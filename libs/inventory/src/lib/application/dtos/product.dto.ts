import { IsString, IsNumber, Length, IsOptional, IsNotEmpty, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { ProductEntity } from "../../domain/entities/product.entity";

export class CreateProductDto {
    @ApiProperty({ type: String, example: 'Safety Jacket Type 1' })
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name!: string;

    @ApiProperty({ type: String, example: 'PZX-001122' })
    @IsString()
    @IsNotEmpty()
    @Length(6, 20)
    sku!: string;

    @ApiProperty({ type: Number, example: 85.50 })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    amount!: number;

    @ApiPropertyOptional({ type: String, example: 'USD', default: 'USD' })
    @IsOptional()
    @IsString()
    @Length(3, 3)
    currency?: string;

    @ApiPropertyOptional({ type: Number, example: 100 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    reorderPoint?: number;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    @Length(0, 250)
    description?: string | null;

    @ApiPropertyOptional({ type: String, example: '60349701438255' })
    @IsOptional()
    @IsString()
    barcode?: string | null;
}

export class UpdateProductDto {
    @ApiProperty({ type: String, example: 'product-uuid' })
    @IsString()
    @IsNotEmpty()
    id!: string;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    @Length(2, 100)
    name?: string | null;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsNumber()
    @Min(0)
    amount?: number | null;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    @Length(3, 3)
    currency?: string | null;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsNumber()
    @Min(0)
    reorderPoint?: number | null;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    @Length(0, 250)
    description?: string | null;

    @ApiPropertyOptional({ type: String })
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
    @ApiProperty({ type: String }) id!: string;
    @ApiProperty({ type: String }) name!: string;
    @ApiProperty({ type: String }) sku!: string;
    @ApiPropertyOptional({ type: String }) description?: string | null;
    @ApiProperty({ type: Number }) amount!: number;
    @ApiProperty({ type: String }) currency!: string;
    @ApiProperty({ type: Number }) reorderPoint!: number;
    @ApiPropertyOptional({ type: String }) barcode?: string | null;
    @ApiProperty({ type: Boolean }) isActive!: boolean;
    @ApiProperty({ type: String, format: 'date-time' }) createdAt!: Date;
    @ApiProperty({ type: String, format: 'date-time' }) updatedAt!: Date;

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
