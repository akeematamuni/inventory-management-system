import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import {
    IPurchaseOrderRepository, PURCHASE_ORDER_REPOSITORY,
    PurchaseOrderNotFoundException,
} from '../../../domain';

import { ConfirmPurchaseOrderCommand } from './confirm-purchase-order.command';

@CommandHandler(ConfirmPurchaseOrderCommand)
export class ConfirmPurchaseOrderHandler
    implements ICommandHandler<ConfirmPurchaseOrderCommand> {
    constructor(
        @Inject(PURCHASE_ORDER_REPOSITORY)
        private readonly purchaseOrderRepo: IPurchaseOrderRepository,
    ) {}

    async execute(command: ConfirmPurchaseOrderCommand): Promise<void> {
        const { purchaseOrderId } = command;

        const purchaseOrder = await this.purchaseOrderRepo.findById(purchaseOrderId);
        if (!purchaseOrder) throw new PurchaseOrderNotFoundException(purchaseOrderId);

        purchaseOrder.confirm();
        await this.purchaseOrderRepo.save(purchaseOrder);
    }
}
