export class GetAllAdjustmentsQuery {
    constructor(
        public readonly productId?: string,
        public readonly warehouseId?: string,
    ) {}
}
