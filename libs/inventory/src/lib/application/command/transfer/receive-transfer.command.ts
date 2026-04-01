export class ReceiveTransferLine {
    constructor(
        public readonly lineId: string,
        public readonly quantityReceived: number,
    ) {}
}

export class ReceiveTransferCommand {
    constructor(
        public readonly transferId: string,
        public readonly lines: ReceiveTransferLine[],
        public readonly performedBy: string,
    ) {}
}
