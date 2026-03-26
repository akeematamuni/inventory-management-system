export class StockReceivedEvent {
    constructor(
        public readonly purchaseOrderId: string,
        public readonly warehouseId: string,
        public readonly createdBy: string,
        public readonly occurredAt: Date,
        public readonly lines: {
            productId: string;
            unitCostAtOrder: number;
            currency: string,
            quantityReceived: number;
        }[],
        public readonly notes?: string | null
    ) {}
}
