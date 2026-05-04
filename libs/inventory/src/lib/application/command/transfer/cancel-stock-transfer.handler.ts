import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";

import { IStockTransferRepository, STOCK_TRANSFER_REPOSITORY, StockTransferNotFoundException } from '../../../domain';
import { CancelTransferCommand } from './cancel-stock-transfer.command';

@CommandHandler(CancelTransferCommand)
export class CancelTransferHandler implements ICommandHandler<CancelTransferCommand> {
    private readonly logger = new Logger(CancelTransferHandler.name);

    constructor(
        @Inject(STOCK_TRANSFER_REPOSITORY) private readonly transferRepo: IStockTransferRepository
    ) {}

    async execute(command: CancelTransferCommand): Promise<void> {
        const { transferId, performedBy } = command;

        const transfer = await this.transferRepo.findById(transferId);
        if (!transfer) throw new StockTransferNotFoundException(transferId);

        transfer.cancel();
        await this.transferRepo.save(transfer);

        this.logger.warn(
            `Pending stock transfer cancelled. Transfer ID: ${transfer.id} | Performed By: ${performedBy}`
        );
    }
}
