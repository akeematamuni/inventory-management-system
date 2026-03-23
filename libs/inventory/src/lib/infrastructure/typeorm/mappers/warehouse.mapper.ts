// import { WarehouseEntity } from '../../../domain';
// import { WarehouseEntityTypeOrm } from '../entities/warehouse.entity';

// export class WarehouseMapper {
//     public static toDomain(raw: WarehouseEntityTypeOrm): WarehouseEntity {
//         return WarehouseEntity.reconstitute(
//             {
//                 name: raw.name,
//                 code: raw.code,
//                 address: raw.address,
//                 isActive: raw.isActive,
//                 createdAt: raw.createdAt,
//                 updatedAt: raw.updatedAt
//             },
//             raw.id
//         );
//     }

//     public static toPersistence(domain: WarehouseEntity): WarehouseEntityTypeOrm {
//         const entity = new WarehouseEntityTypeOrm();
//         entity.id = domain.id;
//         entity.name = domain.name;
//         entity.code = domain.code;
//         entity.address = domain.address;
//         entity.isActive = domain.isActive;
//         entity.createdAt = domain.createdAt;
//         entity.updatedAt = domain.updatedAt;
//         return entity;
//     }
// }
