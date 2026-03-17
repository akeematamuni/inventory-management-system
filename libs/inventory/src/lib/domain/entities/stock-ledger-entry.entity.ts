import { Entity, BaseId } from "@inventory/core/domain";
import { MovementType } from "../value-objects/movement-type.vo";

export interface StockLedgerEntryProps {
    productId: string;
    warehouseId: string;
    movementType: MovementType;
    quantityChange: number;
    balanceAfter: number;
    referenceId: string;
    referenceType: string;
    performedBy: string;
    notes?: string | null;
    occurredAt: Date;
}

export interface CreateStockLedgerEntryProps {
    productId: string;
    warehouseId: string;
    movementType: MovementType;
    quantityChange: number;
    balanceAfter: number;
    referenceId: string;
    referenceType: string;
    performedBy: string;
    notes?: string | null;
}

/**
 * Immutable record of every stock movement.
 * Append-only: no update() or delete() methods exist by design.
 * The balance of any product/warehouse can always be reconstructed by summing all entries for that combination.
*/

export class StockLedgerEntryEntity extends Entity<StockLedgerEntryProps> {
    private constructor(props: StockLedgerEntryProps, id: string) {
        super(props, id);
    }

    public static create(props: CreateStockLedgerEntryProps): StockLedgerEntryEntity {
        return new StockLedgerEntryEntity(
            {
                ...props,
                notes: props.notes?.trim(),
                occurredAt: new Date()
            },
            BaseId.generate().value
        );
    }

    public static reconstitute(props: StockLedgerEntryProps, id: string): StockLedgerEntryEntity {
        return new StockLedgerEntryEntity(props, id);
    }

    get productId(): string {
        return this.props.productId;
    }

    get warehouseId(): string {
        return this.props.warehouseId;
    }
    get movementType(): MovementType {
        return this.props.movementType;
    }

    get quantityChange(): number {
        return this.props.quantityChange;
    }

    get balanceAfter(): number {
        return this.props.balanceAfter;
    }
    get referenceId(): string {
        return this.props.referenceId;
    }

    get referenceType(): string {
        return this.props.referenceType;
    }

    get performedBy(): string {
        return this.props.performedBy;
    }

    get notes(): string | null | undefined {
        return this.props.notes;
    }

    get occurredAt(): Date {
        return this.props.occurredAt
    }
}
