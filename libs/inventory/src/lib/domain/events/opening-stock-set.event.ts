export class OpeningStockSetEvent {
    constructor(
        public readonly productId: string,
        public readonly warehouseId: string,
        public readonly quantity: number,
        public readonly createdBy: string,
        public readonly occurredAt: Date,
    ) {}
}
