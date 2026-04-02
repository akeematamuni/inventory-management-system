import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import {
    StockBalanceEntity, StockLedgerEntryEntity, 
    StockAlertEntity, StockAlertStatus, MovementType
} from '../../domain';

export enum ValuationMethod {
    FIFO = 'FIFO',
    AVCO = 'AVCO',
}

// Deals with balance
export class StockLevelResponseDto {
    @ApiProperty() productId!: string;
    @ApiProperty() warehouseId!: string;
    @ApiProperty() quantity!: number;
    @ApiProperty() updatedAt!: Date;

    static fromDomain(balance: StockBalanceEntity): StockLevelResponseDto {
        const dto = new StockLevelResponseDto();
        dto.productId = balance.productId;
        dto.warehouseId = balance.warehouseId;
        dto.quantity = balance.quantity;
        dto.updatedAt = balance.updatedAt;
        return dto;
    }
}

// Deals with ledger
export class MovementHistoryResponseDto {
    @ApiProperty() id!: string;
    @ApiProperty() productId!: string;
    @ApiProperty() warehouseId!: string;
    @ApiProperty() movementType!: MovementType;
    @ApiProperty() quantityChange!: number;
    @ApiProperty() balanceAfter!: number;
    @ApiProperty() referenceId!: string;
    @ApiProperty() referenceType!: string;
    @ApiProperty() performedBy!: string;
    @ApiPropertyOptional() notes?: string | null;
    @ApiProperty() occurredAt!: Date;

    static fromDomain(entry: StockLedgerEntryEntity): MovementHistoryResponseDto {
        const dto = new MovementHistoryResponseDto();
        dto.id = entry.id;
        dto.productId = entry.productId;
        dto.warehouseId = entry.warehouseId;
        dto.movementType = entry.movementType;
        dto.quantityChange = entry.quantityChange;
        dto.balanceAfter = entry.balanceAfter;
        dto.referenceId = entry.referenceId;
        dto.referenceType = entry.referenceType;
        dto.performedBy = entry.performedBy;
        dto.notes = entry.notes;
        dto.occurredAt = entry.occurredAt;
        return dto;
    }
}

// Deals with alert
export class StockAlertResponseDto {
    @ApiProperty() id!: string;
    @ApiProperty() productId!: string;
    @ApiProperty() warehouseId!: string;
    @ApiProperty() currentBalance!: number;
    @ApiProperty() reorderPoint!: number;
    @ApiProperty() status!: StockAlertStatus;
    @ApiPropertyOptional() resolvedAt?: Date | null;
    @ApiProperty() createdAt!: Date;

    static fromDomain(alert: StockAlertEntity): StockAlertResponseDto {
        const dto = new StockAlertResponseDto();
        dto.id = alert.id;
        dto.productId = alert.productId;
        dto.warehouseId = alert.warehouseId;
        dto.currentBalance = alert.currentBalance;
        dto.reorderPoint = alert.reorderPoint;
        dto.status = alert.status;
        dto.resolvedAt = alert.resolvedAt;
        dto.createdAt = alert.createdAt;
        return dto;
    }
}

// Deals with valuation
export class InventoryValuationResponseDto {
    @ApiProperty() productId: string;
    @ApiProperty() warehouseId: string;
    @ApiProperty() currentBalance: number;
    @ApiProperty() totalValue: number;
    @ApiProperty() valuationMethod: ValuationMethod;

    constructor(
        productId: string,
        warehouseId: string,
        currentBalance: number,
        totalValue: number,
        valuationMethod: ValuationMethod,
    ) {
        this.productId = productId;
        this.warehouseId = warehouseId;
        this.currentBalance = currentBalance;
        this.totalValue = totalValue;
        this.valuationMethod = valuationMethod;
    }
}
