import { Entity, BaseId } from "@inventory/core/domain";

export enum StockAlertStatus {
    UNRESOLVED = 'UNRESOLVED',
    RESOLVED   = 'RESOLVED'
}

export interface StockAlertProps {
    productId: string;
    warehouseId: string;
    currentBalance: number;
    reorderPoint: number;
    status: StockAlertStatus;
    resolvedAt?: Date | null;
    createdAt: Date;
}

export interface CreateStockAlertProps {
    productId: string;
    warehouseId: string;
    currentBalance: number;
    reorderPoint: number;
}

/**
 * Helps to records every instance where a product balance dropped at or below its reorder point.
 * Also provides a way to query alert history for warehouse managers.
*/
export class StockAlertEntity extends Entity<StockAlertProps> {
    private constructor(props: StockAlertProps, id: string) {
        super(props, id);
    }

    public static create(props: CreateStockAlertProps): StockAlertEntity {
        return new StockAlertEntity(
            {
                ...props,
                status: StockAlertStatus.UNRESOLVED,
                createdAt: new Date()
            },
            BaseId.generate().value
        );
    }

    public static reconstitute(props: StockAlertProps, id: string): StockAlertEntity {
        return new StockAlertEntity(props, id);
    }

    public resolve(): void {
        if (this.status === StockAlertStatus.RESOLVED) {
            throw new Error('Stock alert already resolved');
        }
        
        this.props.status = StockAlertStatus.RESOLVED;
        this.props.resolvedAt = new Date();
    }

    get productId(): string { return this.props.productId; }
    get warehouseId(): string { return this.props.warehouseId; }
    get currentBalance(): number { return this.props.currentBalance; }
    get reorderPoint(): number { return this.props.reorderPoint; }
    get status(): StockAlertStatus { return this.props.status; }
    get resolvedAt(): Date | null | undefined { return this.props.resolvedAt; }
    get createdAt(): Date { return this.props.createdAt; }
}
