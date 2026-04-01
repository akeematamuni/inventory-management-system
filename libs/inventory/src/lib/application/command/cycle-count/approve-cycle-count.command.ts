export class ApproveCycleCountCommand {
    constructor(
        public readonly cycleCountId: string,
        public readonly approvedBy: string,
    ) {}
}
