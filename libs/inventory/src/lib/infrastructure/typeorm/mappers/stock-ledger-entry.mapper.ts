import { StockLedgerEntryEntity } from "../../../domain";
import { StockLedgerEntryEntityTypeOrm } from "../entities/stock-ledger-entry.entity";

export class StockLedgerEntryMapper {
    public static toDomain(raw: StockLedgerEntryEntityTypeOrm): StockLedgerEntryEntity {
        return StockLedgerEntryEntity.reconstitute(
            {
                productId: raw.productId,
                warehouseId: raw.warehouseId,
                movementType: raw.movementType,
                quantityChange: raw.quantityChange,
                balanceAfter: raw.balanceAfter,
                referenceId: raw.referenceId,
                referenceType: raw.referenceType,
                performedBy: raw.performedBy,
                notes: raw.notes,
                occurredAt: raw.occurredAt,
            },
            raw.id
        );
    }

    public static toPersistence(domain: StockLedgerEntryEntity): StockLedgerEntryEntityTypeOrm {
        const entity = new StockLedgerEntryEntityTypeOrm();
        entity.id = domain.id;
        entity.productId = domain.productId;
        entity.warehouseId = domain.warehouseId;
        entity.movementType = domain.movementType;
        entity.quantityChange = domain.quantityChange;
        entity.balanceAfter = domain.balanceAfter;
        entity.referenceId = domain.referenceId;
        entity.referenceType = domain.referenceType;
        entity.performedBy = domain.performedBy;
        entity.notes = domain.notes;
        entity.occurredAt = domain.occurredAt;
        return entity;
    }
}
