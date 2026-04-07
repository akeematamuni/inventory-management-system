export class DeactivateWarehouseCommand {
    constructor(
        public readonly id: string,
        public readonly user?: string
    ) {}
}
