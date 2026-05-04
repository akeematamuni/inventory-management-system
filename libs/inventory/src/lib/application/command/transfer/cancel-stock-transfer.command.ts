export class CancelTransferCommand {
    constructor(
        public readonly transferId: string,
        public readonly performedBy: string
    ) {}
}
