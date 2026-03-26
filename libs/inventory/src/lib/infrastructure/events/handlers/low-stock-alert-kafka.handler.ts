import { Controller, Inject } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import {
    IStockBalanceRepository, IProductSettingsRepository, IStockAlertRepository,
    STOCK_BALANCE_REPOSITORY, PRODUCT_SETTINGS_REPOSITORY, STOCK_ALERT_REPOSITORY,
    StockTransferDispatchedEvent, AdjustmentCreatedEvent, StockReceivedEvent,
    CycleCountApprovedEvent, OpeningStockSetEvent,
    StockTransferReceivedEvent
} from "../../../domain";

import { LowStockAlertHandler } from "./low-stock-alert.handler";

@Controller()
export class LowStockAlertHandlerKafka extends LowStockAlertHandler {
    constructor(
        @Inject(STOCK_ALERT_REPOSITORY)
        alertRepo: IStockAlertRepository,
        @Inject(STOCK_BALANCE_REPOSITORY)
        balanceRepo: IStockBalanceRepository,
        @Inject(PRODUCT_SETTINGS_REPOSITORY)
        productSettingRepo:IProductSettingsRepository
    ) {
        super(alertRepo, balanceRepo, productSettingRepo);
    }

    @EventPattern('inventory.adjustment_created')
    override async handleAdjustmentCreatedEvent(@Payload() event: AdjustmentCreatedEvent): Promise<void> {
        await super.handleAdjustmentCreatedEvent(event);
    }

    @EventPattern('inventory.cycle_count_approved')
    override async handleCycleCountApprovedEvent(@Payload() event: CycleCountApprovedEvent): Promise<void> {
        await super.handleCycleCountApprovedEvent(event);
    }

    @EventPattern('inventory.opening_stock_set')
    override async handleOpeningStockSetEvent(@Payload() event: OpeningStockSetEvent): Promise<void> {
        await super.handleOpeningStockSetEvent(event);
    }

    @EventPattern('inventory.stock_received')
    override async handleStockReceivedEvent(@Payload() event: StockReceivedEvent): Promise<void> {
        await super.handleStockReceivedEvent(event);
    }

    @EventPattern('inventory.stock_transfer_dispatched')
    override async handleStockTransferDispatchedEvent(@Payload() event: StockTransferDispatchedEvent): Promise<void> {
        await super.handleStockTransferDispatchedEvent(event);
    }

    @EventPattern('inventory.stock_transfer_received')
    override async handleStockTransferReceivedEvent(@Payload() event: StockTransferReceivedEvent): Promise<void> {
        await super.handleStockTransferReceivedEvent(event);
    }
}
