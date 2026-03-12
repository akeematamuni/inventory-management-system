import { Entity, BaseId } from "@inventory/core/domain";

export interface StockBalanceProps {
    productId: string;
    warehouseId: string;
    quantity: number;
    updatedAt: Date;
}

export interface CreateStockBalanceProps {
    productId: string;
    warehouseId: string;
}

/**
 * Materialised stock balance per product per warehouse.
 * Never modified directly by business logic, only updated as a side effect of writing a StockLedgerEntry.
 * Exists purely for fast reads, avoids summing the entire ledger every time a stock level is queried.
*/
export class StockBalanceEntity extends Entity<StockBalanceProps> {
    private constructor(props: StockBalanceProps, id: string) {
        super(props, id);
    }

    public static create(props: CreateStockBalanceProps): StockBalanceEntity {
        return new StockBalanceEntity(
            {
                ...props,
                quantity: 0,
                updatedAt: new Date()
            },
            BaseId.generate().value
        );
    }

    public static reconstitute(props: StockBalanceProps, id: string): StockBalanceEntity {
        return new StockBalanceEntity(props, id);
    }

    public apply(newQuantity: number): void {
        const quantity = this.props.quantity + newQuantity;
        if (quantity < 0) {
            throw new Error(`Cannot have negative stock balance. Current: ${this.props.quantity}`);
        }

        this.props.quantity = quantity;
    }

    public isStockLow(reorderPoint: number): boolean {
        return this.props.quantity <= reorderPoint;
    }

    get productId(): string {
        return this.props.productId;
    }

    get warehouseId(): string {
        return this.props.warehouseId;
    }

    get quantity(): number {
        return this.props.quantity;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
