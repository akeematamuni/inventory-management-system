import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { IAdjustmentRepository, AdjustmentEntity } from '../../../domain';
import { AdjustmentEntityTypeOrm } from '../entities/adjustment.entity';
import { AdjustmentMapper } from '../mappers/adjustment.mapper';

@Injectable()
export class AdjustmentRepositoryTypeOrm implements IAdjustmentRepository {
    constructor(
        @InjectRepository(AdjustmentEntityTypeOrm)
        private readonly repository: Repository<AdjustmentEntityTypeOrm>
    ) {}

    async save(adjustment: AdjustmentEntity, manager?: EntityManager): Promise<AdjustmentEntity> {
        const repo = manager ? manager.getRepository(AdjustmentEntityTypeOrm) : this.repository;
        const entity = AdjustmentMapper.toPersistence(adjustment);
        const saved = await repo.save(entity);
        return AdjustmentMapper.toDomain(saved);
    }

    async findById(id: string, manager?: EntityManager): Promise<AdjustmentEntity | null> {
        const repo = manager ? manager.getRepository(AdjustmentEntityTypeOrm) : this.repository;
        const entity = await repo.findOne({ where: { id } });
        return entity ? AdjustmentMapper.toDomain(entity) : null;
    }

    async findAll(manager?: EntityManager): Promise<AdjustmentEntity[]> {
        const repo = manager ? manager.getRepository(AdjustmentEntityTypeOrm) : this.repository;
        const entities = await repo.find({ order: { createdAt: 'DESC' } });
        return entities.map(e => AdjustmentMapper.toDomain(e));
    }

    async findByProduct(productId: string, manager?: EntityManager): Promise<AdjustmentEntity[]> {
        const repo = manager ? manager.getRepository(AdjustmentEntityTypeOrm) : this.repository;
        const entities = await repo.find({
            where: { productId },
            order: { createdAt: 'DESC' },
        });
        return entities.map(e => AdjustmentMapper.toDomain(e));
    }

    async findByWarehouse(warehouseId: string, manager?: EntityManager): Promise<AdjustmentEntity[]> {
        const repo = manager ? manager.getRepository(AdjustmentEntityTypeOrm) : this.repository;
        const entities = await repo.find({
            where: { warehouseId },
            order: { createdAt: 'DESC' },
        });
        return entities.map(e => AdjustmentMapper.toDomain(e));
    }
}
