import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested, Min, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PurchaseOrderEntity, PurchaseOrderStatus } from '../../domain';

export class CreatePurchaseOrderLineDto {
    @ApiProperty({ example: 'product-uuid' })
    @IsString()
    @IsNotEmpty()
    productId!: string;

    @ApiProperty({ example: 500 })
    @IsNumber()
    @Min(1)
    quantityOrdered!: number;

    @ApiProperty({ example: 85.50 })
    @IsNumber()
    @Min(0)
    unitCostAtOrder!: number;

    @ApiPropertyOptional({ example: 'USD', default: 'USD' })
    @IsOptional()
    @IsString()
    @Length(3, 3)
    currency?: string;
}

export class CreatePurchaseOrderDto {
    @ApiProperty({ example: 'warehouse-uuid' })
    @IsString()
    @IsNotEmpty()
    warehouseId!: string;

    @ApiProperty({ example: 'HeadWarmer Ltd' })
    @IsString()
    @IsNotEmpty()
    supplierName!: string;

    @ApiProperty({ type: [CreatePurchaseOrderLineDto] })
    @IsArray()
    @Type(() => CreatePurchaseOrderLineDto)
    @ValidateNested({ each: true })
    lines!: CreatePurchaseOrderLineDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;
}

export class GoodsReceiptLineDto {
    @ApiProperty({ example: 'line-uuid' })
    @IsString()
    @IsNotEmpty()
    lineId!: string;

    @ApiProperty({ example: 480 })
    @IsNumber()
    @Min(0)
    quantityReceived!: number;
}

export class ConfirmGoodsReceiptDto {
    @ApiProperty({ type: [GoodsReceiptLineDto] })
    @IsArray()
    @Type(() => GoodsReceiptLineDto)
    @ValidateNested({ each: true })
    lines!: GoodsReceiptLineDto[];
}

export class PurchaseOrderLineResponseDto {
    @ApiProperty() id!: string;
    @ApiProperty() productId!: string;
    @ApiProperty() quantityOrdered!: number;
    @ApiProperty() quantityReceived!: number;
    @ApiProperty() unitCostAtOrder!: number;
    @ApiProperty() currency!: string;
    @ApiProperty() isFullyReceived!: boolean;
    @ApiProperty() remainingQuantity!: number;
}

export class PurchaseOrderResponseDto {
    @ApiProperty() 
    id!: string;

    @ApiProperty() 
    warehouseId!: string;

    @ApiProperty() 
    supplierName!: string;

    @ApiProperty() 
    status!: PurchaseOrderStatus;

    @ApiProperty({ type: [PurchaseOrderLineResponseDto] })
    lines!: PurchaseOrderLineResponseDto[];

    @ApiPropertyOptional() 
    notes?: string | null;

    @ApiProperty() 
    createdBy!: string;

    @ApiProperty() 
    createdAt!: Date;

    @ApiProperty() 
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
