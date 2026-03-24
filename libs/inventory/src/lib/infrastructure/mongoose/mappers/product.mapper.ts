import { Types } from "mongoose";
import { ProductEntity, StockKeepingUnit, Money } from "../../../domain";
import { ProductDocument } from "../schemas/product.schema";

/** Note: Money is handled safely to prevent lossy values or rounding errors */
export class ProductMapper {
    public static toDomain(raw: ProductDocument): ProductEntity {
        return ProductEntity.reconstitute(
            {
                name: raw.name,
                sku: StockKeepingUnit.create(raw.sku),
                description: raw.description,
                unitCost: Money.create(Number(raw.unitCost.toString()), raw.currency),
                reorderPoint: raw.reorderPoint,
                barcode: raw.barcode,
                isActive: raw.isActive,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt
            },
            raw._id
        );
    }

    public static toPersistence(domain: ProductEntity): Partial<ProductDocument> {
        return {
            _id: domain.id,
            sku: domain.sku.value,
            name: domain.name,
            description: domain.description,
            unitCost: Types.Decimal128.fromString(domain.unitCost.amount.toString()),
            currency: domain.unitCost.currency,
            reorderPoint: domain.reorderPoint,
            barcode: domain.barcode,
            isActive: domain.isActive,
        }
    }
}
