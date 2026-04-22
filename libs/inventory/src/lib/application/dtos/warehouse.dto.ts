import { IsString, IsOptional, IsNotEmpty, Length } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { WarehouseEntity } from "../../domain/entities/warehouse.entity";

export class CreateWarehouseDto {
    @ApiProperty({ example: 'Texas Warehouse' })
    @IsString()
    @Length(3, 20)
    name!: string;

    @ApiProperty({ example: 'TXS001', description: '2-10 uppercase alphanumeric characters' })
    @IsString()
    @IsNotEmpty()
    @Length(2, 10)
    code!: string;

    @ApiPropertyOptional({ example: '11 Industrial Avenue, Available Town.' })
    @IsString()
    @IsOptional()
    @Length(1, 250)
    address?: string;
}

export class UpdateWarehouseDto {
    // @ApiProperty()
    // @IsString()
    // id!: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @Length(1, 100)
    name?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @Length(1, 250)
    address?: string;
}

export class WarehouseResponseDto {
    @ApiProperty({ type: String }) id!: string;
    @ApiProperty({ type: String }) name!: string;
    @ApiProperty({ type: String }) code!: string;
    @ApiPropertyOptional({ type: String }) address?: string | null;
    @ApiProperty({ type: Boolean }) isActive!: boolean;
    @ApiProperty({ type: String, format: 'date-time' }) createdAt!: Date;
    @ApiProperty({ type: String, format: 'date-time' }) updatedAt!: Date;

    static fromDomain(warehouse: WarehouseEntity): WarehouseResponseDto {
        const dto = new WarehouseResponseDto();
        dto.id = warehouse.id;
        dto.name = warehouse.name;
        dto.code = warehouse.code;
        dto.address = warehouse.address;
        dto.isActive = warehouse.isActive;
        dto.createdAt = warehouse.createdAt;
        dto.updatedAt = warehouse.updatedAt;
        return dto;
    }
}
