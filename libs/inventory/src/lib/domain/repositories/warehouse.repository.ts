import { WarehouseEntity } from '../entities/warehouse.entity';

export interface IWarehouseRepository {
    save(warehouse: WarehouseEntity, manager?: unknown): Promise<WarehouseEntity>;

    findById(id: string, manager?: unknown): Promise<WarehouseEntity | null>;
    findByCode(code: string, manager?: unknown): Promise<WarehouseEntity | null>;
    findAll(manager?: unknown): Promise<WarehouseEntity[]>;

    exists(id: string, manager?: unknown): Promise<boolean>;
    codeExists(code: string, manager?: unknown): Promise<boolean>;
}

export const WAREHOUSE_REPOSITORY = Symbol('WAREHOUSE_REPOSITORY');
