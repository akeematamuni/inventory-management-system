export class ConfirmPurchaseOrderCommand {
    constructor(
        public readonly purchaseOrderId: string,
        public readonly performedBy?: string,
    ) {}
}
