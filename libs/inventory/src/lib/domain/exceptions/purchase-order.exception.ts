export class PurchaseOrderNotFoundException extends Error {
    constructor(id: string) {
        super(`Purchase order with id "${id}" was not found`);
        this.name = 'PurchaseOrderNotFoundException';
    }
}

export class PurchaseOrderLineNotFoundException extends Error {
    constructor(lineId: string, purchaseOrderId: string) {
        super(`Line "${lineId}" was not found on purchase order "${purchaseOrderId}"`);
        this.name = 'PurchaseOrderLineNotFoundException';
    }
}
