export class SubmitCycleCountLine {
    constructor(
        public readonly lineId: string,
        public readonly countedQuantity: number,
    ) {}
}

export class SubmitCycleCountCommand {
    constructor(
        public readonly cycleCountId: string,
        public readonly lines: SubmitCycleCountLine[],
        public readonly performedBy: string
    ) {}
}
