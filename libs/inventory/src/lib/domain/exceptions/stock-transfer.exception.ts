export class StockTransferNotFoundException extends Error {
    constructor(id: string) {
        super(`Stock transfer with id "${id}" was not found`);
        this.name = 'StockTransferNotFoundException';
    }
}

export class SameWarehouseTransferException extends Error {
    constructor() {
        super('Source and destination warehouses must be different');
        this.name = 'SameWarehouseTransferException';
    }
}
