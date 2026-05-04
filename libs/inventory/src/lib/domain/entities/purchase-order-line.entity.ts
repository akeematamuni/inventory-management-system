import { Entity, BaseId } from '@inventory/core/domain';

export interface PurchaseOrderLineProps {
    purchaseOrderId: string;
    productId: string;
    unitCostAtOrder: number;
    quantityOrdered: number;
    quantityReceived: number;
    currency: string;
}

export interface CreatePurchaseOrderLineProps {
    purchaseOrderId: string;
    productId: string;
    unitCostAtOrder: number;
    quantityOrdered: number;
    currency?: string;
}

/**
 * Represents a single product line within a Purchase Order.
 * Tracks both ordered and received quantities to support partial receipts.
*/
export class PurchaseOrderLineEntity extends Entity<PurchaseOrderLineProps> {
    private constructor(props: PurchaseOrderLineProps, id: string) {
        super(props, id);
    }

    public static create(props: CreatePurchaseOrderLineProps): PurchaseOrderLineEntity {
        return new PurchaseOrderLineEntity(
            {
                ...props,
                quantityReceived: 0,
                currency: props.currency ?? 'USD'
            },
            BaseId.generate().value
        );
    }

    public static reconstitute(props: PurchaseOrderLineProps, id: string): PurchaseOrderLineEntity {
        return new PurchaseOrderLineEntity(props, id);
    }

    public get isFullyRecieved(): boolean {
        return this.props.quantityReceived >= this.props.quantityOrdered;
    }

    public get remainingQuantity(): number {
        return this.props.quantityOrdered - this.props.quantityReceived;
    }

    public recieve(quantity: number): void {
        this.props.quantityReceived += quantity;
    }

    get purchaseOrderId(): string {
        return this.props.purchaseOrderId;
    }

    get productId(): string {
        return this.props.productId;
    }

    get unitCostAtOrder(): number {
        return this.props.unitCostAtOrder;
    }

    get quantityOrdered(): number {
        return this.props.quantityOrdered;
    }

    get quantityReceived(): number {
        return this.props.quantityReceived;
    }

    get currency(): string {
        return this.props.currency;
    }
}
