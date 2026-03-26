import { Injectable, Inject } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import {
    IStockBalanceRepository, IProductSettingsRepository, IStockAlertRepository,
    STOCK_BALANCE_REPOSITORY, PRODUCT_SETTINGS_REPOSITORY, STOCK_ALERT_REPOSITORY,
    StockTransferDispatchedEvent, AdjustmentCreatedEvent, StockReceivedEvent,
    CycleCountApprovedEvent, StockAlertEntity, OpeningStockSetEvent,
    StockTransferReceivedEvent
} from "../../../domain";

/**
 * Checks for a breach of reorder point and alerts
 * This will store alert to database as unresolved, notification is handled in another module.
*/

@Injectable()
export class LowStockAlertHandler {
    constructor(
        @Inject(STOCK_ALERT_REPOSITORY)
        private readonly alertRepo: IStockAlertRepository,
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
        if (!balance.isStockLow(product.reorderPoint)) return;

        const alertExists = await this.alertRepo.findUnresolvedByProductAndWarehouse(productId, warehouseId);
        if (alertExists) return;

        const alert = StockAlertEntity.create({
            productId,
            warehouseId,
            currentBalance: balance.quantity,
            reorderPoint: product.reorderPoint
        });

        await this.alertRepo.save(alert);

        /**
         * NOTE: Another alert should be fired here for cross-module subscription 
         * Also to trigger the exact module that dispatches the notification
        */
    }

    private async checkAndResolve(productId: string, warehouseId: string): Promise<void> {
        const [product, balance] = await Promise.all([
            this.productSettingRepo.findById(productId),
            this.balanceRepo.findByProductAndWarehouse(productId, warehouseId)
        ]);

        if (!product || !balance) return;
        if (balance.isStockLow(product.reorderPoint)) return;

        const alertExists = await this.alertRepo.findUnresolvedByProductAndWarehouse(productId, warehouseId);
        if (!alertExists) return;

        alertExists.resolve();
        await this.alertRepo.save(alertExists);
    }

    /** Events that can cause downward movement */
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

    /** Events that can cause upward movement */
    @OnEvent(OpeningStockSetEvent.name, { async: true })
    async handleOpeningStockSetEvent(event: OpeningStockSetEvent): Promise<void> {
        await this.checkAndResolve(event.productId, event.warehouseId);
    }

    @OnEvent(StockReceivedEvent.name, {async: true })
    async handleStockReceivedEvent(event: StockReceivedEvent): Promise<void> {
        for (const e of event.lines) {
            await this.checkAndResolve(e.productId, event.warehouseId);
        }
    }

    @OnEvent(StockTransferReceivedEvent.name, { async: true })
    async handleStockTransferReceivedEvent(event: StockTransferReceivedEvent): Promise<void> {
        for (const e of event.lines) {
            await this.checkAndResolve(e.productId, event.destinationWarehouseId);
        }
    }
}
