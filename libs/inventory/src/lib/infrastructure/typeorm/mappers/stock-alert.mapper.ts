import { StockAlertEntityTypeOrm } from '../entities/stock-alert.entity';
import { StockAlertEntity } from '../../../domain';

export class StockAlertMapper {
    public static toDomain(raw: StockAlertEntityTypeOrm): StockAlertEntity {
        return StockAlertEntity.reconstitute(
            {
                productId: raw.productId,
                warehouseId: raw.warehouseId,
                currentBalance: raw.currentBalance,
                reorderPoint: raw.reorderPoint,
                status: raw.status,
                resolvedAt: raw.resolvedAt,
                createdAt: raw.createdAt,
            },
            raw.id
        );
    }

    public static toPersistence(domain: StockAlertEntity): StockAlertEntityTypeOrm {
        const entity = new StockAlertEntityTypeOrm();
        entity.id = domain.id;
        entity.productId = domain.productId;
        entity.warehouseId = domain.warehouseId;
        entity.currentBalance = domain.currentBalance;
        entity.reorderPoint = domain.reorderPoint;
        entity.status = domain.status;
        entity.resolvedAt = domain.resolvedAt;
        entity.createdAt = domain.createdAt;
        return entity;
    }
}
