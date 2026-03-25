export class StockReceivedEvent {
    constructor(
        public readonly purchaseOrderId: string,
        public readonly productId: string,
        public readonly warehouseId: string,
        public readonly quantity: number,
        public readonly unitCost: number,
        public readonly currency: string,
        public readonly createdBy: string,
        public readonly occurredAt: Date,
        public readonly notes?: string | null
    ) {}
}
