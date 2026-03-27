export class CreateWarehouseCommand {
    constructor(
        public readonly name: string,
        public readonly code: string,
        public readonly address?: string | null
    ) {}
}
