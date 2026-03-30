export class CreateProductCommand {
    constructor(
        public readonly name: string,
        public readonly sku: string,
        public readonly amount: number,
        public readonly currency?: string,
        public readonly reorderPoint?: number,
        public readonly description?: string,
        public readonly barcode?: string
    ) {}
}
