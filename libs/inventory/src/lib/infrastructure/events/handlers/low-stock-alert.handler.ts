import { Injectable, Inject } from "@nestjs/common";
import { OnEvent, EventEmitter2 } from "@nestjs/event-emitter";

import {
    IStockBalanceRepository, IProductSettingsRepository,
    STOCK_BALANCE_REPOSITORY, PRODUCT_SETTINGS_REPOSITORY,
    StockTransferDispatchedEvent, AdjustmentCreatedEvent,
    CycleCountApprovedEvent, StockDepletedEvent
} from "../../../domain";

/**
 * Only downward movements can breach a reorder point
 * Receipts and opening stock move balance UP — no alert needed
*/

@Injectable()
export class LowStockAlertHandler {
    constructor(
        @Inject(EventEmitter2)
        private readonly eventEmitter: EventEmitter2,
        @Inject(STOCK_BALANCE_REPOSITORY)
        private readonly balanceRepo: IStockBalanceRepository,
        @Inject(PRODUCT_SETTINGS_REPOSITORY)
        private readonly productSettingRepo:IProductSettingsRepository
    ) {}

    private async checkAndAlert(productId: string, warehouseId: string): Promise<void> {
        const [product, balance] = await Promise.all([
            this.productSettingRepo.findById(productId),
            this.balanceRepo.findByProductAndWarehouse(productId, warehouseId)
        ]);

        if (!product || !balance) return;

        if (balance.isStockLow(product.reorderPoint)) {
            this.eventEmitter.emit(
                StockDepletedEvent.name,
                new StockDepletedEvent(
                    productId,
                    warehouseId,
                    balance.quantity,
                    product.reorderPoint,
                    new Date()
                )
            );
        }
    }

    @OnEvent(StockTransferDispatchedEvent.name, { async: true })
    async handleStockTransferDispatchedEvent(event: StockTransferDispatchedEvent): Promise<void> {
        for (const e of event.lines) {
            await this.checkAndAlert(e.productId, event.sourceWarehouseId);
        }
    }

    @OnEvent(AdjustmentCreatedEvent.name, { async: true })
    async handleAdjustmentCreatedEvent(event: AdjustmentCreatedEvent): Promise<void> {
        await this.checkAndAlert(event.productId, event.warehouseId);
    }

    @OnEvent(CycleCountApprovedEvent.name, { async: true })
    async handleCycleCountApprovedEvent(event: CycleCountApprovedEvent): Promise<void> {
        for (const e of event.lines) {
            if (e.variance < 0) {
                await this.checkAndAlert(e.productId, event.warehouseId);
            }
        }
    }
}
