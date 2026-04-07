export class UpdateProductCommand {
    constructor(
        public readonly id: string,
        public readonly name?: string | null,
        public readonly amount?: number | null,
        public readonly currency?: string | null,
        public readonly reorderPoint?: number | null,
        public readonly description?: string | null,
        public readonly barcode?: string | null,
        public readonly user?: string | null
    ) {}
}
