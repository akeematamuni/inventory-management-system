export class StockTransferReceivedEvent {
    constructor(
        public readonly transferId: string,
        public readonly sourceWarehouseId: string,
        public readonly destinationWarehouseId: string,
        public readonly createdBy: string,
        public readonly occurredAt: Date,
        public readonly lines: {
            productId: string;
            quantityReceived: number;
            variance: number;
        }[],
    ) {}
}
