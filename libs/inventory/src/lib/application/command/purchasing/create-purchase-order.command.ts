export class CreatePurchaseOrderLine {
    constructor(
        public readonly productId: string,
        public readonly quantityOrdered: number,
        public readonly unitCostAtOrder: number,
        public readonly currency: string,
    ) {}
}

export class CreatePurchaseOrderCommand {
    constructor(
        public readonly warehouseId: string,
        public readonly supplierName: string,
        public readonly lines: CreatePurchaseOrderLine[],
        public readonly createdBy: string,
        public readonly notes?: string,
    ) {}
}
