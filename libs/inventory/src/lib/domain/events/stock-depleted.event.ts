export class StockDepletedEvent {
    constructor(
        public readonly productId: string,
        public readonly warehouseId: string,
        public readonly currentBalance: number,
        public readonly reorderPoint: number,
        public readonly occurredAt: Date,
    ) {}
}
