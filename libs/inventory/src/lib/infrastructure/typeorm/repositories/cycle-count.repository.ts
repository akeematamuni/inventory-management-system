import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { ICycleCountRepository, CycleCountEntity, CycleCountStatus } from '../../../domain';
import { CycleCountEntityTypeOrm } from '../entities/cycle-count.entity';
import { CycleCountMapper } from '../mappers/cycle-count.mapper';

@Injectable()
export class CycleCountRepositoryTypeOrm implements ICycleCountRepository {
    constructor(
        @InjectRepository(CycleCountEntityTypeOrm)
        private readonly repository: Repository<CycleCountEntityTypeOrm>
    ) {}

    async save(cycleCount: CycleCountEntity, manager?: EntityManager): Promise<CycleCountEntity> {
        const repo = manager ? manager.getRepository(CycleCountEntityTypeOrm) : this.repository;
        const entity = CycleCountMapper.toPersistence(cycleCount);
        const saved = await repo.save(entity);
        return CycleCountMapper.toDomain(saved);
    }

    async findById(id: string, manager?: EntityManager): Promise<CycleCountEntity | null> {
        const repo = manager ? manager.getRepository(CycleCountEntityTypeOrm) : this.repository;
        const entity = await repo.findOne({
            where: { id },
            relations: ['lines'],
        });
        return entity ? CycleCountMapper.toDomain(entity) : null;
    }

    async findAll(manager?: EntityManager): Promise<CycleCountEntity[]> {
        const repo = manager ? manager.getRepository(CycleCountEntityTypeOrm) : this.repository;
        const entities = await repo.find({
            relations: ['lines'],
            order: { createdAt: 'DESC' },
        });
        return entities.map(CycleCountMapper.toDomain);
    }

    async findByStatus(status: CycleCountStatus, manager?: EntityManager): Promise<CycleCountEntity[]> {
        const repo = manager ? manager.getRepository(CycleCountEntityTypeOrm): this.repository;
        const entities = await repo.find({
            where: { status },
            relations: ['lines'],
            order: { createdAt: 'DESC' },
        });
        return entities.map(CycleCountMapper.toDomain);
    }

    async findByWarehouse(warehouseId: string, manager?: EntityManager): Promise<CycleCountEntity[]> {
        const repo = manager ? manager.getRepository(CycleCountEntityTypeOrm) : this.repository;
        const entities = await repo.find({
            where: { warehouseId },
            relations: ['lines'],
            order: { createdAt: 'DESC' },
        });
        return entities.map(CycleCountMapper.toDomain);
    }

    async exists(id: string, manager?: EntityManager): Promise<boolean> {
        const repo = manager ? manager.getRepository(CycleCountEntityTypeOrm) : this.repository;
        return await repo.count({ where: { id } }) > 0;
    }
}
