import { Injectable, Inject } from "@nestjs/common";
import { DataSource, EntityManager } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { OnEvent } from "@nestjs/event-emitter";

import {
    IStockBalanceRepository, IStockLedgerEntryRepository,
    STOCK_BALANCE_REPOSITORY, STOCK_LEDGER_ENTRY_REPOSITORY,
    StockBalanceEntity, StockLedgerEntryEntity, MovementType,
    StockReceivedEvent, StockTransferDispatchedEvent,
    StockTransferReceivedEvent, AdjustmentCreatedEvent,
    CycleCountApprovedEvent, OpeningStockSetEvent
} from "../../../domain";

interface Params {
    productId: string;
    warehouseId: string;
    quantityChange: number;
    movementType: MovementType;
    referenceId: string;
    referenceType: string;
    notes?: string | null;
    createdBy: string;
    occurredAt: Date;
    manager: EntityManager;
}

/** Handle all events with side effects that writes to the immutable ledger and stock balance */

@Injectable()
export class StockBalanceUpdateHandler {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
        @Inject(STOCK_BALANCE_REPOSITORY)
        private readonly balanceRepo: IStockBalanceRepository,
        @Inject(STOCK_LEDGER_ENTRY_REPOSITORY)
        private readonly ledgerRepo: IStockLedgerEntryRepository
    ) {}

    /**
     * Protected method that updates the ledger and balance
     * To be called with a transaction to ensure atomicity
     * Every event handler method is just a thin wrapper that calls with the right arguments
    */
    protected async applyUpdate(params: Params): Promise<void> {
        const { productId, warehouseId, quantityChange, manager } = params;

        const balance = await this.balanceRepo.findByProductAndWarehouse(productId, warehouseId, manager)
            ?? StockBalanceEntity.create({warehouseId, productId});

        balance.apply(quantityChange);

        const ledgerEntry = StockLedgerEntryEntity.create({
            productId,
            warehouseId,
            quantityChange,
            movementType: params.movementType,
            balanceAfter: balance.quantity,
            referenceId: params.referenceId,
            referenceType: params.referenceType,
            notes: params.notes,
            performedBy: params.createdBy
        });

        await this.ledgerRepo.save(ledgerEntry, manager);
        await this.balanceRepo.save(balance, manager);
    }

    @OnEvent(OpeningStockSetEvent.name, { async: true })
    async handleOpeningStockSetEvent(event: OpeningStockSetEvent): Promise<void> {
        await this.dataSource.transaction(async (manager: EntityManager) => {
            await this.applyUpdate({
                productId: event.productId,
                warehouseId: event.warehouseId,
                quantityChange: event.quantity,
                movementType: MovementType.OPENING_STOCK,
                referenceId: event.productId,
                referenceType: 'OPENING_STOCK',
                createdBy: event.createdBy,
                occurredAt: event.occurredAt,
                manager
            });
        });
    }

    @OnEvent(StockReceivedEvent.name, { async: true })
    async handleStockReceivedEvent(event: StockReceivedEvent): Promise<void> {
        await this.dataSource.transaction(async (manager: EntityManager) => {
            await this.applyUpdate({
                productId: event.productId,
                warehouseId: event.warehouseId,
                quantityChange: event.quantity,
                movementType: MovementType.RECEIPT,
                referenceId: event.purchaseOrderId,
                referenceType: 'PURCHASE_ORDER',
                notes: event.notes,
                createdBy: event.createdBy,
                occurredAt: event.occurredAt,
                manager
            });
        });
    }

    @OnEvent(StockTransferDispatchedEvent.name, { async: true })
    async handleStockTransferDispatchedEvent(event: StockTransferDispatchedEvent): Promise<void> {
        await this.dataSource.transaction(async (manager: EntityManager) => {
            for (const e of event.lines) {
                // Note that quantity change is negative, hence the minus (-)
                await this.applyUpdate({
                    productId: e.productId,
                    warehouseId: event.sourceWarehouseId,
                    quantityChange: -e.quantityDispatched,
                    movementType: MovementType.TRANSFER_OUT,
                    referenceId: event.transferId,
                    referenceType: 'STOCK_TRANSFER',
                    notes: event.notes,
                    createdBy: event.createdBy,
                    occurredAt: event.occurredAt,
                    manager
                });
            }
        });
    }

    @OnEvent(StockTransferReceivedEvent.name, { async: true })
    async handleStockTransferReceivedEvent(event: StockTransferReceivedEvent): Promise<void> {
        await this.dataSource.transaction(async (manager: EntityManager) => {
            for (const e of event.lines) {
                await this.applyUpdate({
                    productId: e.productId,
                    warehouseId: event.destinationWarehouseId,
                    quantityChange: e.quantityReceived,
                    movementType: MovementType.TRANSFER_OUT,
                    referenceId: event.transferId,
                    referenceType: 'STOCK_TRANSFER',
                    notes: event.notes,
                    createdBy: event.createdBy,
                    occurredAt: event.occurredAt,
                    manager
                });

                // If there is variance, update source
                if (e.variance) {
                    await this.applyUpdate({
                        productId: e.productId,
                        warehouseId: event.sourceWarehouseId,
                        quantityChange: -e.variance,
                        movementType: MovementType.ADJUSTMENT_DOWN,
                        referenceId: event.transferId,
                        referenceType: 'STOCK_TRANSFER_VARIANCE',
                        createdBy: event.createdBy,
                        occurredAt: event.occurredAt,
                        manager
                    });
                }
            }
        });
    }

    @OnEvent(AdjustmentCreatedEvent.name, { async: true })
    async handleAdjustmentCreatedEvent(event: AdjustmentCreatedEvent): Promise<void> {
        const change = event.movementType === MovementType.ADJUSTMENT_UP
            ? event.quantity : -event.quantity;
        
        await this.dataSource.transaction(async (manager: EntityManager) => {
            await this.applyUpdate({
                productId: event.productId,
                warehouseId: event.warehouseId,
                quantityChange: change,
                movementType: event.movementType as MovementType,
                referenceId: event.adjustmentId,
                referenceType: 'ADJUSTMENT',
                notes: event.notes,
                createdBy: event.createdBy,
                occurredAt: event.occurredAt,
                manager
            });
        });
    }

    @OnEvent(CycleCountApprovedEvent.name, { async: true })
    async handleCycleCountApprovedEvent(event: CycleCountApprovedEvent): Promise<void> {
        await this.dataSource.transaction(async (manager: EntityManager) => {
            for (const e of event.lines) {
                if (!e.variance) continue;

                await this.applyUpdate({
                    productId: e.productId,
                    warehouseId: event.warehouseId,
                    quantityChange: e.variance,
                    movementType: MovementType.CYCLE_COUNT_ADJ,
                    referenceId: event.cycleCountId,
                    referenceType: 'CYCLE_COUNT',
                    createdBy: event.approvedBy,
                    occurredAt: event.occurredAt,
                    manager
                });
            }
        });
    }
}
