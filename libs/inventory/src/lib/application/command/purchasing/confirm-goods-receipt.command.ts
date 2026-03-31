export class GoodsReceiptLine {
    constructor(
        public readonly lineId: string,
        public readonly quantityReceived: number,
    ) {}
}

export class ConfirmGoodsReceiptCommand {
    constructor(
        public readonly purchaseOrderId: string,
        public readonly lines: GoodsReceiptLine[],
        public readonly performedBy: string,
    ) {}
}
