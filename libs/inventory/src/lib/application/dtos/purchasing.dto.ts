import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested, Min, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PurchaseOrderStatus } from '../../domain/entities/purchase-order.entity';
import type { PurchaseOrderEntity } from '../../domain/entities/purchase-order.entity';

export class CreatePurchaseOrderLineDto {
    @ApiProperty({ type: String, example: 'product-uuid' })
    @IsString()
    @IsNotEmpty()
    productId!: string;

    @ApiProperty({ type: Number, example: 500 })
    @IsNumber()
    @Min(1)
    quantityOrdered!: number;

    @ApiProperty({ type: Number, example: 85.50 })
    @IsNumber()
    @Min(0)
    unitCostAtOrder!: number;

    @ApiPropertyOptional({ type: String, example: 'USD', default: 'USD' })
    @IsOptional()
    @IsString()
    @Length(3, 3)
    currency?: string;
}

export class CreatePurchaseOrderDto {
    @ApiProperty({ type: String, example: 'warehouse-uuid' })
    @IsString()
    @IsNotEmpty()
    warehouseId!: string;

    @ApiProperty({ type: String, example: 'HeadWarmer Ltd' })
    @IsString()
    @IsNotEmpty()
    supplierName!: string;

    @ApiProperty({ type: () => [CreatePurchaseOrderLineDto] })
    @IsArray()
    @Type(() => CreatePurchaseOrderLineDto)
    @ValidateNested({ each: true })
    lines!: CreatePurchaseOrderLineDto[];

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class GoodsReceiptLineDto {
    @ApiProperty({ type: String, example: 'line-uuid' })
    @IsString()
    @IsNotEmpty()
    lineId!: string;

    @ApiProperty({ type: Number, example: 480 })
    @IsNumber()
    @Min(0)
    quantityReceived!: number;
}

export class ConfirmGoodsReceiptDto {
    @ApiProperty({ type: () => [GoodsReceiptLineDto] })
    @IsArray()
    @Type(() => GoodsReceiptLineDto)
    @ValidateNested({ each: true })
    lines!: GoodsReceiptLineDto[];
}

export class PurchaseOrderLineResponseDto {
    @ApiProperty({ type: String }) id!: string;
    @ApiProperty({ type: String }) productId!: string;
    @ApiProperty({ type: Number }) quantityOrdered!: number;
    @ApiProperty({ type: Number }) quantityReceived!: number;
    @ApiProperty({ type: Number }) unitCostAtOrder!: number;
    @ApiProperty({ type: String }) currency!: string;
    @ApiProperty({ type: Boolean }) isFullyReceived!: boolean;
    @ApiProperty({ type: Number }) remainingQuantity!: number;
}

export class PurchaseOrderResponseDto {
    @ApiProperty({ type: String }) 
    id!: string;

    @ApiProperty({ type: String }) 
    warehouseId!: string;

    @ApiProperty({ type: String }) 
    supplierName!: string;

    @ApiProperty({ enum: PurchaseOrderStatus }) 
    status!: PurchaseOrderStatus;

    @ApiProperty({ type: () => [PurchaseOrderLineResponseDto] })
    lines!: PurchaseOrderLineResponseDto[];

    @ApiPropertyOptional({ type: String }) 
    notes?: string | null;

    @ApiProperty({ type: String }) 
    createdBy!: string;

    @ApiProperty({ type: String, format: 'date-time' }) 
    createdAt!: Date;

    @ApiProperty({ type: String, format: 'date-time' })
    updatedAt!: Date;

    public static fromDomain(entity: PurchaseOrderEntity): PurchaseOrderResponseDto {
        const res = new PurchaseOrderResponseDto();
        res.id = entity.id;
        res.warehouseId = entity.warehouseId;
        res.supplierName = entity.supplierName;
        res.status = entity.status;
        res.lines = entity.lines.map(line => {
            const lineDto = new PurchaseOrderLineResponseDto();
            lineDto.id = line.id;
            lineDto.productId = line.productId;
            lineDto.quantityOrdered = line.quantityOrdered;
            lineDto.quantityReceived = line.quantityRecieved;
            lineDto.unitCostAtOrder = line.unitCostAtOrder;
            lineDto.currency = line.currency;
            lineDto.isFullyReceived = line.isFullyRecieved;
            lineDto.remainingQuantity = line.remainingQuantity;
            return lineDto;
        });
        res.notes = entity.notes;
        res.createdBy = entity.createdBy;
        res.createdAt = entity.createdAt;
        res.updatedAt = entity.updatedAt;
        return res;
    }
}
