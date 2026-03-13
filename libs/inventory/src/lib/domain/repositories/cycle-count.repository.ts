import { CycleCountEntity, CycleCountStatus } from '../entities/cycle-count.entity';

export interface ICycleCountRepository {
    save(cycleCount: CycleCountEntity, manager?: unknown): Promise<CycleCountEntity>;

    findById(id: string, manager?: unknown): Promise<CycleCountEntity | null>;
    findAll(manager?: unknown): Promise<CycleCountEntity[]>;
    findByStatus(status: CycleCountStatus, manager?: unknown): Promise<CycleCountEntity[]>;
    findByWarehouse(warehouseId: string, manager?: unknown): Promise<CycleCountEntity[]>;

    exists(id: string, manager?: unknown): Promise<boolean>;
}

export const CYCLE_COUNT_REPOSITORY = Symbol('CYCLE_COUNT_REPOSITORY');
