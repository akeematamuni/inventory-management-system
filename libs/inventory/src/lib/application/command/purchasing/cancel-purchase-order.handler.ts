import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";

import {
    IPurchaseOrderRepository, PURCHASE_ORDER_REPOSITORY,
    PurchaseOrderNotFoundException,
} from "../../../domain";

import { CancelPurchaseOrderCommand } from "./cancel-purchase-order.command";

@CommandHandler(CancelPurchaseOrderCommand)
export class CancelPurchaseOrderHandler implements ICommandHandler<CancelPurchaseOrderCommand> {
    private readonly logger = new Logger(CancelPurchaseOrderHandler.name);
    constructor(
        @Inject(PURCHASE_ORDER_REPOSITORY)
        private readonly purchaseOrderRepo: IPurchaseOrderRepository,
    ) {}

    async execute(command: CancelPurchaseOrderCommand): Promise<void> {
        const { purchaseOrderId, performedBy } = command;

        const purchaseOrder = await this.purchaseOrderRepo.findById(purchaseOrderId);
        if (!purchaseOrder) throw new PurchaseOrderNotFoundException(purchaseOrderId);

        purchaseOrder.cancel();
        await this.purchaseOrderRepo.save(purchaseOrder);

        this.logger.warn(`Purchase order canceled. User: ${performedBy} | Order: ${purchaseOrderId}`);
    }
}
