import { Entity, BaseId } from '@inventory/core/domain';
import { CreateCycleCountLineProps, CycleCountLineEntity } from './cycle-count-line.entity';

export enum CycleCountStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export interface CycleCountProps {
    warehouseId: string;
    status: CycleCountStatus;
    lines: CycleCountLineEntity[];
    createdBy: string;
    approvedBy?: string | null;
    notes?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCycleCountProps {
    warehouseId: string;
    lines: Omit<CreateCycleCountLineProps, 'cycleCountId'>[];
    createdBy: string;
    notes?: string | null;
}

/**
 * Handles physical stock counting session for a warehouse.
 * Status machine: OPEN → IN_PROGRESS → PENDING_APPROVAL → APPROVED
 * Status machine: OPEN → IN_PROGRESS → PENDING_APPROVAL → REJECTED → IN_PROGRESS
*/
export class CycleCountEntity extends Entity<CycleCountProps> {
    private constructor(props: CycleCountProps, id: string) {
        super(props, id);
    }

    public static create(props: CreateCycleCountProps): CycleCountEntity {
        if (!props.lines.length) throw new Error('Cycle count must have atleat one product line');

        const now = new Date();
        const id = BaseId.generate().value;
        const lines = props.lines.map(line => CycleCountLineEntity.create({...line, cycleCountId: id}));

        return new CycleCountEntity(
            {
                lines,
                warehouseId: props.warehouseId,
                status: CycleCountStatus.OPEN,
                notes: props.notes?.trim() ?? null,
                createdBy: props.createdBy,
                approvedBy: null,
                createdAt: now,
                updatedAt: now
            },
            id
        );
    }

    public static reconstitute(props: CycleCountProps, id: string): CycleCountEntity {
        return new CycleCountEntity(props, id);
    }

    /** 
     * Submit counted quantities for specific lines. 
     * Automatically transitions to IN_PROGRESS on first submission. 
    */
    public submitLines(submissions: { lineId: string, countedQuantity: number }[]): CycleCountLineEntity[] {
        if (this.props.status === CycleCountStatus.APPROVED) {
            throw new Error('Cannot submit count when cycle count has been approved. Create a new cycle count');
        }

        if (this.props.status === CycleCountStatus.REJECTED) {
            throw new Error('Cannot submit count when cycle count has been rejected. Create a new cycle count');
        }

        const updatedLines: CycleCountLineEntity[] = [];

        for (const submission of submissions) {
            const line = this.props.lines.find(_line => _line.id === submission.lineId);

            if (!line) throw new Error(`Line "${submission.lineId}" does not belong to this cycle count`);

            line.submitCount(submission.countedQuantity);
            updatedLines.push(line);
        }

        this.props.status = this.props.lines.every(line => line.isCounted())
            ? CycleCountStatus.PENDING_APPROVAL
            : CycleCountStatus.IN_PROGRESS;

        return updatedLines
    }

    /** 
     * Approves the count.
     * Returns only lines with variance, application service writes CYCLE_COUNT_ADJ ledger entries for these.
    */
    public approve(approvedBy: string): CycleCountLineEntity[] {
        if (this.props.status !== CycleCountStatus.PENDING_APPROVAL) {
            throw new Error('Only count pending approval can be approved');
        }

        this.props.status = CycleCountStatus.APPROVED;
        this.props.approvedBy = approvedBy;

        return this.props.lines.filter(line => line.hasVariance())
    }

    public reject(): void {
        if (this.props.status !== CycleCountStatus.PENDING_APPROVAL) {
            throw new Error('Only count pending approval can be rejected');
        }

        this.props.status = CycleCountStatus.REJECTED;
    }

    get warehouseId(): string { return this.props.warehouseId; }
    get status(): CycleCountStatus { return this.props.status; }
    get lines(): CycleCountLineEntity[] { return this.props.lines; }
    get createdBy(): string { return this.props.createdBy; }
    get approvedBy(): string | null | undefined { return this.props.approvedBy; }
    get notes(): string | null | undefined { return this.props.notes; }
    get createdAt(): Date { return this.props.createdAt; }
    get updatedAt(): Date { return this.props.updatedAt; }
}
