import { ValueObject } from "@inventory/core/domain";

export enum AdjustmentReasonCode {
    DAMAGE = 'DAMAGE',
    THEFT = 'THEFT',
    EXPIRY = 'EXPIRY',
    COUNTING_ERROR = 'COUNTING_ERROR',
    FOUND_STOCK = 'FOUND_STOCK',
    OTHER = 'OTHER'
}

export interface AdjustmentReasonProps {
    code: AdjustmentReasonCode;
    notes?: string | null;
}

/**
 * Describes why a manual stock adjustment was made.
 * When code is OTHER, notes are mandatory, every adjustment must be explainable for audit purposes.
*/
export class AdjustmentReason extends ValueObject<AdjustmentReasonProps> {
    private constructor(props: AdjustmentReasonProps) {
        super(props);
    }

    public static create(props: AdjustmentReasonProps): AdjustmentReason {
        if (props.code === AdjustmentReasonCode.OTHER && !props.notes?.trim()) {
            throw new Error(`Notes are required when adjustment reason is ${AdjustmentReasonCode.OTHER}`);
        }

        return new AdjustmentReason({
            code: props.code,
            notes: props.notes?.trim() ?? null
        });
    }

    get notes() : string | null | undefined {
        return this.props.notes;
    }

    get code(): AdjustmentReasonCode {
        return this.props.code;
    }
}
