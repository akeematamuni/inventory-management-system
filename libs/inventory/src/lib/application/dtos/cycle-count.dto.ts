import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

import { CycleCountEntity, CycleCountStatus } from "../../domain/entities/cycle-count.entity";

export class CreateCycleCountLineDto {
    @ApiProperty({ example: 'product-uuid' })
    @IsString()
    @IsNotEmpty()
    productId!: string;

    @ApiProperty({ example: 300, description: 'Current system balance at time of count creation' })
    @IsNumber()
    @Min(0)
    systemQuantity!: number;
}

export class CreateCycleCountDto {
    @ApiProperty({ example: 'warehouse-uuid' })
    @IsString()
    @IsNotEmpty()
    warehouseId!: string;

    @ApiProperty({ type: () => [CreateCycleCountLineDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateCycleCountLineDto)
    lines!: CreateCycleCountLineDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;
}

export class SubmitCycleCountLineDto {
    @ApiProperty({ example: 'line-uuid' })
    @IsString()
    @IsNotEmpty()
    lineId!: string;

    @ApiProperty({ example: 287, description: 'Physical count observed on the shelf' })
    @IsNumber()
    @Min(0)
    countedQuantity!: number;
}

export class SubmitCycleCountDto {
    @ApiProperty({ example: 'cycle-count-uuid' })
    @IsString()
    @IsNotEmpty()
    cycleCountId!: string;

    @ApiProperty({ type: () => [SubmitCycleCountLineDto] })
    @IsArray()
    @Type(() => SubmitCycleCountLineDto)
    @ValidateNested({ each: true })
    lines!: SubmitCycleCountLineDto[];
}

export class ApproveOrRejectCycleCountDto {
    @ApiProperty({ example: 'cycle-count-uuid' })
    @IsString()
    @IsNotEmpty()
    cycleCountId!: string;
}

export class CycleCountLineResponseDto {
    @ApiProperty() id!: string;
    @ApiProperty() productId!: string;
    @ApiProperty() systemQuantity!: number;
    @ApiPropertyOptional() countedQuantity?: number | null;
    @ApiPropertyOptional() variance?: number | null;
    @ApiProperty() isCounted!: boolean;
}

export class CycleCountResponseDto {
    @ApiProperty() id!: string;
    @ApiProperty() warehouseId!: string;
    @ApiProperty() status!: CycleCountStatus;
    @ApiProperty({ type: () => [CycleCountLineResponseDto] })
    lines!: CycleCountLineResponseDto[];
    @ApiPropertyOptional() approvedBy?: string | null;
    @ApiPropertyOptional() notes?: string | null;
    @ApiProperty() createdBy!: string;
    @ApiProperty() createdAt!: Date;
    @ApiProperty() updatedAt!: Date;

    static fromDomain(cycleCount: CycleCountEntity): CycleCountResponseDto {
        const dto = new CycleCountResponseDto();
        dto.id = cycleCount.id;
        dto.warehouseId = cycleCount.warehouseId;
        dto.status = cycleCount.status;
        dto.lines = cycleCount.lines.map(line => {
            const lineDto = new CycleCountLineResponseDto();
            lineDto.id = line.id;
            lineDto.productId = line.productId;
            lineDto.systemQuantity = line.systemQuantity;
            lineDto.countedQuantity = line.countedQuantity;
            lineDto.variance = line.variance();
            lineDto.isCounted = line.isCounted();
            return lineDto;
        });
        dto.approvedBy = cycleCount.approvedBy;
        dto.notes = cycleCount.notes;
        dto.createdBy = cycleCount.createdBy;
        dto.createdAt = cycleCount.createdAt;
        dto.updatedAt = cycleCount.updatedAt;
        return dto;
    }
}
