export class GetWarehouseQuery {
    constructor(
        public readonly id: string
    ) {}
}

export class GetWarehouseByCodeQuery {
    constructor(
        public readonly code: string
    ) {}
}
