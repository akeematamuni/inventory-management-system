import { StockBalanceEntity } from "../../../domain";
import { StockBalanceEntityTypeOrm } from "../entities/stock-balance.entity";

export class StockBalanceMapper {
    public static toDomain(raw: StockBalanceEntityTypeOrm): StockBalanceEntity {
        return StockBalanceEntity.reconstitute(
            {
                productId: raw.productId,
                warehouseId: raw.warehouseId,
                quantity: raw.quantity,
                updatedAt: raw.updatedAt
            },
            raw.id
        );
    }

    public static toPersistence(domain: StockBalanceEntity): StockBalanceEntityTypeOrm {
        const entity = new StockBalanceEntityTypeOrm();
        entity.id = domain.id;
        entity.productId = domain.productId;
        entity.warehouseId = domain.warehouseId;
        entity.quantity = domain.quantity;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }
}
