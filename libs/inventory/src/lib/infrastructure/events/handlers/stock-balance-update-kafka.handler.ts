import { Controller, Inject } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import {
    IStockBalanceRepository, IStockLedgerEntryRepository, IStockAlertRepository, 
    IProductSettingsRepository,STOCK_BALANCE_REPOSITORY, STOCK_LEDGER_ENTRY_REPOSITORY, 
    STOCK_ALERT_REPOSITORY, PRODUCT_SETTINGS_REPOSITORY, StockReceivedEvent, 
    StockTransferDispatchedEvent,StockTransferReceivedEvent, AdjustmentCreatedEvent, 
    CycleCountApprovedEvent, OpeningStockSetEvent
} from "../../../domain";

import { StockBalanceUpdateHandler } from "./stock-balance-update.handler";

/**
 * Kafka variant of StockBalanceUpdateHandler, activated when KAFKA_ENABLED=true.
 * @EventPattern subscribes to Kafka topics.
*/

@Controller()
export class StockBalanceUpdateHandlerKafka extends StockBalanceUpdateHandler {
    constructor(
        @InjectDataSource()
        dataSource: DataSource,
        @Inject(STOCK_ALERT_REPOSITORY)
        alertRepo: IStockAlertRepository,
        @Inject(STOCK_BALANCE_REPOSITORY)
        balanceRepo: IStockBalanceRepository,
        @Inject(STOCK_LEDGER_ENTRY_REPOSITORY)
        ledgerRepo: IStockLedgerEntryRepository,
        @Inject(PRODUCT_SETTINGS_REPOSITORY)
        productSettingRepo:IProductSettingsRepository
    ) {
        super(dataSource, alertRepo, balanceRepo, ledgerRepo, productSettingRepo);
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
