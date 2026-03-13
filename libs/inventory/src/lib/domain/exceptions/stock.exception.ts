export class InsufficientStockException extends Error {
    constructor(productId: string, warehouseId: string, requested: number, available: number) {
        super(
            `Insufficient stock for product "${productId}" in warehouse "${warehouseId}". ` +
            `Requested: ${requested}, Available: ${available}`
        );
        this.name = 'InsufficientStockException';
    }
}

export class StockBalanceNotFoundException extends Error {
    constructor(productId: string, warehouseId: string) {
        super(`Stock balance not found for product "${productId}" in warehouse "${warehouseId}"`);
        this.name = 'StockBalanceNotFoundException';
    }
}
