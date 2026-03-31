import { Entity, BaseId } from '@inventory/core/domain';
import { PurchaseOrderLineEntity, CreatePurchaseOrderLineProps } from './purchase-order-line.entity';

export enum PurchaseOrderStatus {
    DRAFT = 'DRAFT',
    OPEN = 'OPEN',
    PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
    RECEIVED = 'RECEIVED',
    CANCELLED = 'CANCELLED',
}

export interface PurchaseOrderProps {
    warehouseId: string;
    supplierName: string;
    status: PurchaseOrderStatus;
    lines: PurchaseOrderLineEntity[];
    notes?: string | null;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreatePurchaseOrderProps {
    warehouseId: string;
    supplierName: string;
    lines: Omit<CreatePurchaseOrderLineProps, 'purchaseOrderId'>[];
    notes?: string | null;
    createdBy: string;
}

/**
 * Owns its lines and controls all state transitions.
 * Status machine: DRAFT → OPEN → PARTIALLY_RECEIVED → RECEIVED
 * Status machine: DRAFT → OPEN → CANCELLED
*/
export class PurchaseOrderEntity extends Entity<PurchaseOrderProps> {
    private constructor(props: PurchaseOrderProps, id: string) {
        super(props, id);
    }

    public static create(props: CreatePurchaseOrderProps): PurchaseOrderEntity {
        if (!props.lines.length) throw new Error('Purchase order must have atleast one line');

        const now = new Date();
        const id = BaseId.generate().value;

        const lines = props.lines.map(line => PurchaseOrderLineEntity.create({...line, purchaseOrderId: id}));

        return new PurchaseOrderEntity(
            {
                lines,
                warehouseId: props.warehouseId,
                supplierName: props.supplierName,
                status: PurchaseOrderStatus.DRAFT,
                notes: props.notes?.trim() ?? null,
                createdBy: props.createdBy,
                createdAt: now,
                updatedAt: now
            },
            id
        );
    }

    public static reconstitute(props: PurchaseOrderProps, id: string): PurchaseOrderEntity {
        return new PurchaseOrderEntity(props, id);
    }

    public confirm(): void {
        if (this.props.status !== PurchaseOrderStatus.DRAFT) {
            throw new Error('Only a DRAFT order status can be confirmed');
        }

        this.props.status = PurchaseOrderStatus.OPEN;
    }

    public cancel(): void {
        if (this.props.status === PurchaseOrderStatus.CANCELLED) {
            throw new Error('Purchase order already canceled');
        }

        if (this.props.status === PurchaseOrderStatus.RECEIVED) {
            throw new Error('Fully recieved order cannot be cancelled');
        }

        this.props.status = PurchaseOrderStatus.CANCELLED;
    }

    /**
     * Records received quantities against specific lines.
     * Automatically transitions status based on whether all lines are fully received.
     * Returns the lines that were actually updated, the application service uses these to write the correct ledger entries.
    */
    public recieveLines(receipts: { lineId: string, quantity: number }[]): PurchaseOrderLineEntity[] {
        if (this.props.status === PurchaseOrderStatus.DRAFT) {
            throw new Error('Purchase ordr must be confirmed before recieving stock');
        }

        if (this.props.status === PurchaseOrderStatus.CANCELLED) {
            throw new Error('Cannot recieve stock against a cancelled purchase order');
        }

        if (this.props.status === PurchaseOrderStatus.RECEIVED) {
            throw new Error('Purchase order has been fully recieved');
        }

        const updatedLines: PurchaseOrderLineEntity[] = [];

        for (const receipt of receipts) {
            const line = this.props.lines.find(_line => _line.id === receipt.lineId);

            if (!line) throw new Error(`Line "${receipt.lineId}" deos not belong to this purchase order`);

            line.recieve(receipt.quantity);
            updatedLines.push(line);
        }

        this.props.status = !this.props.lines.every(line => line.isFullyRecieved)
            ?  PurchaseOrderStatus.PARTIALLY_RECEIVED
            :  PurchaseOrderStatus.RECEIVED;
        
        return updatedLines;
    }

    get warehouseId(): string {
        return this.props.warehouseId;
    }

    get supplierName(): string {
        return this.props.supplierName;
    }
 
    get status(): PurchaseOrderStatus {
        return this.props.status
    }

    get lines(): PurchaseOrderLineEntity[] {
        return this.props.lines;
    }

    get notes(): string | null | undefined {
        return this.props.notes;
    }

    get createdBy(): string {
        return this.props.createdBy;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }
    
    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
