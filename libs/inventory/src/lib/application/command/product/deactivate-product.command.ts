export class DeactivateProductCommand {
    constructor(
        public readonly id: string,
        public readonly user?: string
    ) {}
}
