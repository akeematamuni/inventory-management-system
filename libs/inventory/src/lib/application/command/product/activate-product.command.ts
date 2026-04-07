export class ActivateProductCommand {
    constructor(
        public readonly id: string,
        public readonly user?: string
    ) {}

}
