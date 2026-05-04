import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";

import {
    IPurchaseOrderRepository, 
    PURCHASE_ORDER_REPOSITORY,
    IInventoryEventPublisher, 
    INVENTORY_EVENT_PUBLISHER,
    PurchaseOrderNotFoundException, 
    StockReceivedEvent,
} from "../../../domain";

import { ConfirmGoodsReceiptCommand } from "./confirm-goods-receipt.command";

@CommandHandler(ConfirmGoodsReceiptCommand)
export class ConfirmGoodsReceiptHandler implements ICommandHandler<ConfirmGoodsReceiptCommand> {
    private readonly logger = new Logger(ConfirmGoodsReceiptHandler.name);

    constructor(
        @Inject(INVENTORY_EVENT_PUBLISHER)
        private readonly publisher: IInventoryEventPublisher,
        @Inject(PURCHASE_ORDER_REPOSITORY)
        private readonly purchaseOrderRepo: IPurchaseOrderRepository
    ) {}

    async execute(command: ConfirmGoodsReceiptCommand): Promise<void> {
        const { purchaseOrderId, lines, performedBy } = command;

        const purchaseOrder = await this.purchaseOrderRepo.findById(purchaseOrderId);
        if (!purchaseOrder) throw new PurchaseOrderNotFoundException(purchaseOrderId);

        const updatedLines = purchaseOrder.recieveLines(
            lines.map(l => ({ lineId: l.lineId, quantity: l.quantityReceived }))
        );

        await this.purchaseOrderRepo.save(purchaseOrder);
        this.logger.log(`Goods received. User: ${performedBy} | Order: ${purchaseOrderId}`);

        /** Publish event to run in the background updating ledger and balance. */ 
        await this.publisher.publish(
            new StockReceivedEvent(
                purchaseOrder.id,
                purchaseOrder.warehouseId,
                performedBy,
                new Date(),
                updatedLines.map(l => ({
                    productId: l.productId,
                    unitCostAtOrder: l.unitCostAtOrder,
                    currency: l.currency,
                    quantityReceived: l.quantityReceived
                })),
                purchaseOrder.notes
            )
        );
    }
}
