import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { IStockAlertRepository, StockAlertEntity, StockAlertStatus } from '../../../domain';
import { StockAlertEntityTypeOrm } from '../entities/stock-alert.entity';
import { StockAlertMapper } from '../mappers/stock-alert.mapper';

@Injectable()
export class StockAlertRepositoryTypeOrm implements IStockAlertRepository {
    constructor(
        @InjectRepository(StockAlertEntityTypeOrm)
        private readonly repository: Repository<StockAlertEntityTypeOrm>
    ) {}

    async save(alert: StockAlertEntity, manager?: EntityManager): Promise<StockAlertEntity> {
        const repo = manager ? manager.getRepository(StockAlertEntityTypeOrm) : this.repository;
        const entity = StockAlertMapper.toPersistence(alert);
        const saved = await repo.save(entity);
        return StockAlertMapper.toDomain(saved);
    }

    async findById(id: string, manager?: EntityManager): Promise<StockAlertEntity | null> {
        const repo = manager ? manager.getRepository(StockAlertEntityTypeOrm) : this.repository;
        const entity = await repo.findOne({ where: { id } });
        return entity ? StockAlertMapper.toDomain(entity) : null;
    }

    async findAll(manager?: EntityManager): Promise<StockAlertEntity[]> {
        const repo = manager ? manager.getRepository(StockAlertEntityTypeOrm) : this.repository;
        const entities = await repo.find({ order: { createdAt: 'DESC' } });
        return entities.map(e => StockAlertMapper.toDomain(e));
    }

    async findByStatus(status: StockAlertStatus, manager?: EntityManager): Promise<StockAlertEntity[]> {
        const repo = manager ? manager.getRepository(StockAlertEntityTypeOrm) : this.repository;
        const entities = await repo.find({
            where: { status },
            order: { createdAt: 'DESC' }
        });
        return entities.map(e => StockAlertMapper.toDomain(e));
    }

    async findByProduct(productId: string, manager?: EntityManager): Promise<StockAlertEntity[]> {
        const repo = manager ? manager.getRepository(StockAlertEntityTypeOrm) : this.repository;
        const entities = await repo.find({
            where: { productId },
            order: { createdAt: 'DESC' }
        });
        return entities.map(e => StockAlertMapper.toDomain(e));
    }

    async findByWarehouse(warehouseId: string, manager?: EntityManager): Promise<StockAlertEntity[]> {
        const repo = manager ? manager.getRepository(StockAlertEntityTypeOrm) : this.repository;
        const entities = await repo.find({
            where: { warehouseId },
            order: { createdAt: 'DESC' }
        });
        return entities.map(e => StockAlertMapper.toDomain(e));
    }

    async findUnresolvedByProductAndWarehouse(
        productId: string, warehouseId: string, manager?: EntityManager
    ): Promise<StockAlertEntity | null> {
        const repo = manager ? manager.getRepository(StockAlertEntityTypeOrm) : this.repository;
        const entity = await repo.findOne({
            where: {
                productId,
                warehouseId,
                status: StockAlertStatus.UNRESOLVED
            }
        });
        return entity ? StockAlertMapper.toDomain(entity) : null;
    }
}
