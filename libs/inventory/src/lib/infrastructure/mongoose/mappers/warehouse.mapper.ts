import { WarehouseEntity } from '../../../domain';
import { WarehouseDocument } from '../schemas/warehouse.schema';

export class WarehouseMapper {
    public static toDomain(raw: WarehouseDocument): WarehouseEntity {
        return WarehouseEntity.reconstitute(
            {
                name: raw.name,
                code: raw.code,
                address: raw.address,
                isActive: raw.isActive,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt
            },
            raw._id
        );
    }

    public static toPersistence(domain: WarehouseEntity): Partial<WarehouseDocument> {
        return {
            _id: domain.id,
            name: domain.name,
            code: domain.code,
            address: domain.address,
            isActive: domain.isActive,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
        }
    }
}
