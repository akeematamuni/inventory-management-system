export class DispatchTransferCommand {
    constructor(
        public readonly transferId: string,
        public readonly performedBy: string
    ) {}
}
