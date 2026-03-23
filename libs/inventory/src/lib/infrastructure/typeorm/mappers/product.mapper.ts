// import { ProductEntity, StockKeepingUnit, Money } from "../../../domain";
// import { ProductEntityTypeOrm } from "../entities/product.entity";

// /** Note: Money is handled safely to prevent lossy values or rounding errors */
// export class ProductMapper {
//     public static toDomain(raw: ProductEntityTypeOrm): ProductEntity {
//         return ProductEntity.reconstitute(
//             {
//                 name: raw.name,
//                 sku: StockKeepingUnit.create(raw.sku),
//                 description: raw.description,
//                 unitCost: Money.create(Number(raw.unitCost), raw.currency),
//                 reorderPoint: raw.reorderPoint,
//                 barcode: raw.barcode,
//                 isActive: raw.isActive,
//                 createdAt: raw.createdAt,
//                 updatedAt: raw.updatedAt
//             },
//             raw.id
//         );
//     }

//     public static toPersistence(domain: ProductEntity): ProductEntityTypeOrm {
//         const entity = new ProductEntityTypeOrm();
//         entity.id = domain.id;
//         entity.name = domain.name;
//         entity.sku = domain.sku.value;
//         entity.description = domain.description;
//         entity.unitCost = String(domain.unitCost.amount);
//         entity.currency = domain.unitCost.currency;
//         entity.reorderPoint = domain.reorderPoint;
//         entity.barcode = domain.barcode;
//         entity.isActive = domain.isActive;
//         entity.createdAt = domain.createdAt;
//         entity.updatedAt = domain.updatedAt;
//         return entity;
//     }
// }
