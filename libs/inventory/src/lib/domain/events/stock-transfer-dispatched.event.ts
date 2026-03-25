export class StockTransferDispatchedEvent {
    constructor(
        public readonly transferId: string,
        public readonly sourceWarehouseId: string,
        public readonly destinationWarehouseId: string,
        public readonly createdBy: string,
        public readonly occurredAt: Date,
        public readonly lines: {
            productId: string;
            quantityDispatched: number;
        }[],
        public readonly notes?: string | null
    ) {}
}
