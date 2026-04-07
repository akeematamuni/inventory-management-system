import { IsString, IsNumber, Length, IsOptional, IsNotEmpty, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ProductEntity } from "../../domain";

export class CreateProductDto {
    @ApiProperty({ example: 'Safety Jacket Type 1' })
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name!: string;

    @ApiProperty({ example: 'PZX-001122' })
    @IsString()
    @IsNotEmpty()
    @Length(6, 20)
    sku!: string;

    @ApiProperty({ example: 85.50 })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    amount!: number;

    @ApiPropertyOptional({  example: 'USD', default: 'USD' })
    @IsOptional()
    @IsString()
    @Length(3, 3)
    currency?: string;

    @ApiPropertyOptional({ example: 100 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    reorderPoint?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Length(0, 250)
    description?: string | null;

    @ApiPropertyOptional({ example: '60349701438255' })
    @IsOptional()
    @IsString()
    barcode?: string | null;
}

export class UpdateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Length(2, 100)
    name?: string | null;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(0)
    amount?: number | null;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Length(3, 3)
    currency?: string | null;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(0)
    reorderPoint?: number | null;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Length(0, 250)
    description?: string | null;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Length(0, 100)
    barcode?: string | null;

    // @ApiPropertyOptional()
    // @IsOptional()
    // @IsBoolean()
    // isActive?: boolean;
}

export class ProductResponseDto {
    @ApiProperty() id!: string;
    @ApiProperty() name!: string;
    @ApiProperty() sku!: string;
    @ApiPropertyOptional() description?: string | null;
    @ApiProperty() amount!: number;
    @ApiProperty() currency!: string;
    @ApiProperty() reorderPoint!: number;
    @ApiPropertyOptional() barcode?: string | null;
    @ApiProperty() isActive!: boolean;
    @ApiProperty() createdAt!: Date;
    @ApiProperty() updatedAt!: Date;

    public static fromDomain(entity: ProductEntity): ProductResponseDto {
        const res = new ProductResponseDto();
        res.id = entity.id;
        res.name = entity.name;
        res.sku = entity.sku.value;
        res.description = entity.description;
        res.amount = entity.unitCost.amount;
        res.currency = entity.unitCost.currency;
        res.reorderPoint = entity.reorderPoint;
        res.barcode = entity.barcode;
        res.isActive = entity.isActive;
        res.createdAt = entity.createdAt;
        res.updatedAt = entity.updatedAt;
        return res;
    }
}
