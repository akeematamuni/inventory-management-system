export class RejectCycleCountCommand {
    constructor(
        public readonly cycleCountId: string,
        public readonly rejectedBy?: string,
    ) {}
}
