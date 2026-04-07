export class CancelPurchaseOrderCommand {
    constructor(
        public readonly purchaseOrderId: string,
        public readonly performedBy?: string,
    ) {}
}
