import { AdjustmentEntity } from '../entities/adjustment.entity';

export interface IAdjustmentRepository {
    save(adjustment: AdjustmentEntity, manager?: unknown): Promise<AdjustmentEntity>;

    findById(id: string, manager?: unknown): Promise<AdjustmentEntity | null>;
    findAll(manager?: unknown): Promise<AdjustmentEntity[]>;
    findByProduct(productId: string, manager?: unknown): Promise<AdjustmentEntity[]>;
    findByWarehouse(warehouseId: string, manager?: unknown): Promise<AdjustmentEntity[]>;
}

export const ADJUSTMENT_REPOSITORY = Symbol('ADJUSTMENT_REPOSITORY');
