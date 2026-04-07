import { IsString, IsOptional, IsNotEmpty, Length } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { WarehouseEntity } from "../../domain";

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
    @ApiProperty() id!: string;
    @ApiProperty() name!: string;
    @ApiProperty() code!: string;
    @ApiPropertyOptional() address?: string | null;
    @ApiProperty() isActive!: boolean;
    @ApiProperty() createdAt!: Date;
    @ApiProperty() updatedAt!: Date;

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
