import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { AdjustmentEntity, MovementType, AdjustmentReasonCode } from "../../domain";

export class CreateAdjustmentDto {
    @ApiProperty({ example: 'product-uuid' })
    @IsString()
    @IsNotEmpty()
    productId!: string;

    @ApiProperty({ example: 'warehouse-uuid' })
    @IsString()
    @IsNotEmpty()
    warehouseId!: string;

    @ApiProperty({ example: 12 })
    @IsNumber()
    @Min(1)
    quantity!: number;

    @ApiProperty({ enum: [MovementType.ADJUSTMENT_UP, MovementType.ADJUSTMENT_DOWN] })
    @IsEnum([MovementType.ADJUSTMENT_UP, MovementType.ADJUSTMENT_DOWN])
    movementType!: MovementType.ADJUSTMENT_UP | MovementType.ADJUSTMENT_DOWN;

    @ApiProperty({ enum: AdjustmentReasonCode })
    @IsEnum(AdjustmentReasonCode)
    reasonCode!: AdjustmentReasonCode;

    @ApiPropertyOptional({ example: 'Items found damaged on shelf 3B' })
    @IsOptional()
    @IsString()
    reasonNotes?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;
}

export class AdjustmentResponseDto {
    @ApiProperty() id!: string;
    @ApiProperty() productId!: string;
    @ApiProperty() warehouseId!: string;
    @ApiProperty() quantity!: number;
    @ApiProperty() movementType!: MovementType;
    @ApiProperty() reasonCode!: AdjustmentReasonCode;
    @ApiPropertyOptional() reasonNotes?: string | null;
    @ApiProperty() performedBy!: string;
    @ApiPropertyOptional() notes?: string | null;
    @ApiProperty() createdAt!: Date;

    static fromDomain(adjustment: AdjustmentEntity): AdjustmentResponseDto {
        const dto = new AdjustmentResponseDto();
        dto.id = adjustment.id;
        dto.productId = adjustment.productId;
        dto.warehouseId = adjustment.warehouseId;
        dto.quantity = adjustment.quantity;
        dto.movementType = adjustment.movementType;
        dto.reasonCode = adjustment.reason.code;
        dto.reasonNotes = adjustment.reason.notes;
        dto.performedBy = adjustment.createdBy;
        dto.notes = adjustment.notes;
        dto.createdAt = adjustment.createdAt;
        return dto;
    }
}
