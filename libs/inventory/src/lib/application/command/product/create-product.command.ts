export class CreateProductCommand {
    constructor(
        public readonly name: string,
        public readonly sku: string,
        public readonly amount: number,
        public readonly currency?: string,
        public readonly reorderPoint?: number | null,
        public readonly description?: string | null,
        public readonly barcode?: string | null,
        public readonly user?: string | null
    ) {}
}
