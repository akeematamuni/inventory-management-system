export class GetAllProductsQuery {
    constructor(
        public readonly activeOnly?: boolean,
        public readonly search?: string
    ) {}
}
