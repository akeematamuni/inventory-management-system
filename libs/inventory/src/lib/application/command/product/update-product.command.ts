export class UpdateProductCommand {
    constructor(
        public readonly id: string,
        public readonly name?: string,
        public readonly amount?: number,
        public readonly currency?: string,
        public readonly reorderPoint?: number,
        public readonly description?: string,
        public readonly barcode?: string,
        public readonly isActive?: boolean
    ) {}
}
