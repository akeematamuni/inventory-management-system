import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
    WAREHOUSE_REPOSITORY, 
    PRODUCT_REPOSITORY, 
    ADJUSTMENT_REPOSITORY,
    CYCLE_COUNT_REPOSITORY, 
    PRODUCT_SETTINGS_REPOSITORY, 
    PURCHASE_ORDER_REPOSITORY,
    STOCK_ALERT_REPOSITORY, 
    STOCK_BALANCE_REPOSITORY, 
    STOCK_LEDGER_ENTRY_REPOSITORY,
    STOCK_TRANSFER_REPOSITORY, 
    INVENTORY_EVENT_PUBLISHER
} from './domain';

import {
    AdjustmentEntityTypeOrm, 
    CycleCountLineEntityTypeOrm, 
    CycleCountEntityTypeOrm,
    PurchaseOrderLineEntityTypeOrm, 
    PurchaseOrderEntityTypeOrm, 
    ProductSettingsEntityTypeOrm,
    StockAlertEntityTypeOrm, 
    StockBalanceEntityTypeOrm, 
    StockLedgerEntryEntityTypeOrm,
    StockTransferLineEntityTypeOrm, 
    StockTransferEntityTypeOrm,
    WarehouseEntityMongo, 
    WarehouseSchema, 
    ProductEntityMongo, 
    ProductSchema,
    AdjustmentRepositoryTypeOrm, 
    CycleCountRepositoryTypeOrm, 
    ProductSettingsRepository,
    PurchaseOrderRepositoryTypeOrm, 
    StockAlertRepositoryTypeOrm, 
    StockBalanceRepositoryTypeOrm,
    StockLedgerEntryRepositoryTypeOrm, 
    StockTransferRepositoryTypeOrm,
    WarehouseRepositoryMongo, 
    ProductRepositoryMongo,
    InventoryPublisherEmitter, 
    InventoryPublisherKafka,
    StockBalanceUpdateHandler, 
    StockBalanceUpdateHandlerKafka
} from './infrastructure';

import {
    CreateWarehouseHandler, 
    UpdateWarehouseHandler, 
    DeactivateWarehouseHandler,
    CreateProductHandler, 
    UpdateProductHandler, 
    DeactivateProductHandler,
    ActivateProductHandler, 
    CreatePurchaseOrderHandler, 
    ConfirmPurchaseOrderHandler,
    ConfirmGoodsReceiptHandler, 
    CreateStockTransferHandler, 
    DispatchTransferHandler,
    ReceiveTransferHandler, 
    CreateAdjustmentHandler, 
    CreateCycleCountHandler,
    SubmitCycleCountHandler, 
    ApproveCycleCountHandler, 
    RejectCycleCountHandler,
    SetOpeningStockHandler,
    GetWarehouseHandler, 
    GetAllWarehousesHandler, 
    GetProductHandler,
    GetAllProductsHandler, 
    GetPurchaseOrderHandler, 
    GetAllPurchaseOrderHandler,
    GetStockTransferHandler, 
    GetAllStockTransfersHandler, 
    GetAdjustmentHandler,
    GetAllAdjustmentsHandler, 
    GetCycleCountHandler, 
    GetAllCycleCountsHandler,
    GetStockLevelsHandler, 
    GetMovementHistoryHandler, 
    GetStockAlertsHandler,
    GetInventoryValuationHandler,
} from './application';

import {
    WarehouseController, 
    ProductController,
    AdjustmentController, 
    CycleCountController,
    OpeningStockController, 
    PurchaseController,
    ReportingController, 
    StockTransferController
} from './presentation';

const CQRSHandlers = [
    CreateWarehouseHandler, 
    UpdateWarehouseHandler, 
    DeactivateWarehouseHandler,
    CreateProductHandler, 
    UpdateProductHandler, 
    DeactivateProductHandler,
    ActivateProductHandler, 
    CreatePurchaseOrderHandler, 
    ConfirmPurchaseOrderHandler,
    ConfirmGoodsReceiptHandler, 
    CreateStockTransferHandler, 
    DispatchTransferHandler,
    ReceiveTransferHandler, 
    CreateAdjustmentHandler, 
    CreateCycleCountHandler,
    SubmitCycleCountHandler, 
    ApproveCycleCountHandler, 
    RejectCycleCountHandler,
    SetOpeningStockHandler,
    GetWarehouseHandler, 
    GetAllWarehousesHandler, 
    GetProductHandler,
    GetAllProductsHandler, 
    GetPurchaseOrderHandler, 
    GetAllPurchaseOrderHandler,
    GetStockTransferHandler, 
    GetAllStockTransfersHandler, 
    GetAdjustmentHandler,
    GetAllAdjustmentsHandler, 
    GetCycleCountHandler, 
    GetAllCycleCountsHandler,
    GetStockLevelsHandler, 
    GetMovementHistoryHandler, 
    GetStockAlertsHandler,
    GetInventoryValuationHandler,
].map(h => ({ provide: h, useClass: h }));

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AdjustmentEntityTypeOrm,
            CycleCountLineEntityTypeOrm,
            CycleCountEntityTypeOrm,
            PurchaseOrderLineEntityTypeOrm,
            PurchaseOrderEntityTypeOrm,
            ProductSettingsEntityTypeOrm,
            StockAlertEntityTypeOrm,
            StockBalanceEntityTypeOrm,
            StockLedgerEntryEntityTypeOrm,
            StockTransferLineEntityTypeOrm,
            StockTransferEntityTypeOrm
        ]),
        MongooseModule.forFeature([
            { name: WarehouseEntityMongo.name, schema: WarehouseSchema },
            { name: ProductEntityMongo.name, schema: ProductSchema }
        ])
    ],
    controllers: [
        WarehouseController,
        ProductController,
        AdjustmentController,
        CycleCountController,
        OpeningStockController,
        PurchaseController,
        ReportingController,
        StockTransferController
    ],
    providers: [
        {
            provide: INVENTORY_EVENT_PUBLISHER, 
            inject: [EventEmitter2, ConfigService],
            useFactory: (eventEmitter: EventEmitter2, configService: ConfigService) => {
                const kafkaEnabled = configService.get('KAFKA_ENABLED') === 'true';
                return kafkaEnabled 
                    ? new InventoryPublisherKafka(configService)
                    : new InventoryPublisherEmitter(eventEmitter);
            }
        },
        { provide: StockBalanceUpdateHandler, useClass: StockBalanceUpdateHandler },
        { provide: StockBalanceUpdateHandlerKafka, useClass: StockBalanceUpdateHandlerKafka },

        { provide: WAREHOUSE_REPOSITORY, useClass: WarehouseRepositoryMongo },
        { provide: PRODUCT_REPOSITORY, useClass: ProductRepositoryMongo },
        { provide: ADJUSTMENT_REPOSITORY, useClass: AdjustmentRepositoryTypeOrm },
        { provide: CYCLE_COUNT_REPOSITORY, useClass: CycleCountRepositoryTypeOrm },
        { provide: PRODUCT_SETTINGS_REPOSITORY, useClass: ProductSettingsRepository },
        { provide: PURCHASE_ORDER_REPOSITORY, useClass: PurchaseOrderRepositoryTypeOrm },
        { provide: STOCK_ALERT_REPOSITORY, useClass: StockAlertRepositoryTypeOrm },
        { provide: STOCK_BALANCE_REPOSITORY, useClass: StockBalanceRepositoryTypeOrm },
        { provide: STOCK_LEDGER_ENTRY_REPOSITORY, useClass: StockLedgerEntryRepositoryTypeOrm },
        { provide: STOCK_TRANSFER_REPOSITORY, useClass: StockTransferRepositoryTypeOrm },
        
        ...CQRSHandlers
    ],
    exports: [],
})
export class InventoryModule {}
