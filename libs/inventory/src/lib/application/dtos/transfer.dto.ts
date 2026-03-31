import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

import { StockTransferStatus, StockTransferEntity } from "../../domain";

export class CreateStockTransferLineDto {
    @ApiProperty({ example: 'product-uuid' })
    @IsString()
    @IsNotEmpty()
    productId!: string;

    @ApiProperty({ example: 100 })
    @IsNumber()
    @Min(1)
    quantityRequested!: number;
}

export class CreateStockTransferDto {
    @ApiProperty({ example: 'source-warehouse-uuid' })
    @IsString()
    @IsNotEmpty()
    sourceWarehouseId!: string;

    @ApiProperty({ example: 'destination-warehouse-uuid' })
    @IsString()
    @IsNotEmpty()
    destinationWarehouseId!: string;

    @ApiProperty({ type: [CreateStockTransferLineDto] })
    @IsArray()
    @Type(() => CreateStockTransferLineDto)
    @ValidateNested({ each: true })
    lines!: CreateStockTransferLineDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;
}

export class ReceiveTransferLineDto {
    @ApiProperty({ example: 'line-uuid' })
    @IsString()
    @IsNotEmpty()
    lineId!: string;

    @ApiProperty({ example: 98 })
    @IsNumber()
    @Min(0)
    quantityReceived!: number;
}

export class ReceiveTransferDto {
    @ApiProperty({ type: [ReceiveTransferLineDto] })
    @IsArray()
    @Type(() => ReceiveTransferLineDto)
    @ValidateNested({ each: true })
    lines!: ReceiveTransferLineDto[];
}

export class StockTransferLineResponseDto {
    @ApiProperty() id!: string;
    @ApiProperty() productId!: string;
    @ApiProperty() quantityRequested!: number;
    @ApiProperty() quantityDispatched!: number;
    @ApiProperty() quantityReceived!: number;
    @ApiProperty() variance!: number;
    @ApiProperty() isFullyReceived!: boolean;
}

export class StockTransferResponseDto {
    @ApiProperty() id!: string;
    @ApiProperty() sourceWarehouseId!: string;
    @ApiProperty() destinationWarehouseId!: string;
    @ApiProperty() status!: StockTransferStatus;
    @ApiProperty({ type: [StockTransferLineResponseDto] })
    lines!: StockTransferLineResponseDto[];
    @ApiPropertyOptional() notes?: string | null;
    @ApiProperty() createdBy!: string;
    @ApiProperty() createdAt!: Date;
    @ApiProperty() updatedAt!: Date;

    static fromDomain(transfer: StockTransferEntity): StockTransferResponseDto {
        const dto = new StockTransferResponseDto();
        dto.id = transfer.id;
        dto.sourceWarehouseId = transfer.sourceWarehouseId;
        dto.destinationWarehouseId = transfer.destinationWarehouseId;
        dto.status = transfer.status;
        dto.lines = transfer.lines.map(line => {
            const lineDto = new StockTransferLineResponseDto();
            lineDto.id = line.id;
            lineDto.productId = line.productId;
            lineDto.quantityRequested = line.quantityRequested;
            lineDto.quantityDispatched = line.quantityDispatched;
            lineDto.quantityReceived = line.quantityReceived;
            lineDto.variance = line.variance;
            lineDto.isFullyReceived = line.isFullyReceived;
            return lineDto;
        });
        dto.notes = transfer.notes;
        dto.createdBy = transfer.createdBy;
        dto.createdAt = transfer.createdAt;
        dto.updatedAt = transfer.updatedAt;
        return dto;
    }
}
