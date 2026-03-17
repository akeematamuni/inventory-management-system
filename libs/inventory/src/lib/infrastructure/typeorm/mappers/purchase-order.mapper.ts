import { PurchaseOrderEntity, PurchaseOrderLineEntity } from "../../../domain";
import { PurchaseOrderLineEntityTypeOrm } from "../entities/purchase-order-line.entity";
import { PurchaseOrderEntityTypeOrm } from "../entities/purchase-order.entity";

export class PurchaseOrderMapper {
    public static toDomain(raw: PurchaseOrderEntityTypeOrm): PurchaseOrderEntity {
        return PurchaseOrderEntity.reconstitute(
            {
                warehouseId: raw.warehouseId,
                supplierName: raw.supplierName,
                status: raw.status,
                lines: raw.lines.map((line) => PurchaseOrderMapper.toLineDomain(line)),
                notes: raw.notes,
                createdBy: raw.createdBy,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt
            },
            raw.id
        );
    }

    public static toPersistence(domain: PurchaseOrderEntity): PurchaseOrderEntityTypeOrm {
        const entity = new PurchaseOrderEntityTypeOrm();
        entity.id = domain.id;
        entity.warehouseId = domain.warehouseId;
        entity.supplierName = domain.supplierName;
        entity.status = domain.status;
        entity.notes = domain.notes;
        entity.lines = domain.lines.map((line) => PurchaseOrderMapper.toLinePersistence(line));
        entity.createdBy = domain.createdBy;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }

    private static toLineDomain(raw: PurchaseOrderLineEntityTypeOrm): PurchaseOrderLineEntity {
        return PurchaseOrderLineEntity.reconstitute(
            {
                purchaseOrderId: raw.purchaseOrderId,
                productId: raw.productId,
                unitCostAtOrder: raw.unitCostAtOrder,
                quantityOrdered: raw.quantityOrdered,
                quantityRecieved: raw.quantityRecieved,
                currency: raw.currency
            },
            raw.id
        );
    }

    private static toLinePersistence(domain: PurchaseOrderLineEntity): PurchaseOrderLineEntityTypeOrm {
        const entity = new PurchaseOrderLineEntityTypeOrm();
        entity.purchaseOrderId = domain.purchaseOrderId;
        entity.productId = domain.productId;
        entity.unitCostAtOrder = domain.unitCostAtOrder;
        entity.quantityOrdered = domain.quantityOrdered;
        entity.quantityRecieved = domain.quantityRecieved;
        entity.currency = domain.currency;
        return entity;
    }
}
