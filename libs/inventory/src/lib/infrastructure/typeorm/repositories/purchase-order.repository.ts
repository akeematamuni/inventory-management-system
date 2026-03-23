import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

import { IPurchaseOrderRepository, PurchaseOrderEntity, PurchaseOrderStatus } from "../../../domain";
import { PurchaseOrderEntityTypeOrm } from "../entities/purchase-order.entity";
import { PurchaseOrderMapper } from "../mappers/purchase-order.mapper";

@Injectable()
export class PurchaseOrderRepositoryTypeOrm implements IPurchaseOrderRepository {
    constructor(
        @InjectRepository(PurchaseOrderEntityTypeOrm)
        private readonly repository: Repository<PurchaseOrderEntityTypeOrm>
    ) {}

    async save(purchaseOrder: PurchaseOrderEntity, manager?: EntityManager): Promise<PurchaseOrderEntity> {
        const repo = manager ? manager.getRepository(PurchaseOrderEntityTypeOrm) : this.repository;
        const entity = PurchaseOrderMapper.toPersistence(purchaseOrder);
        const saved = await repo.save(entity);
        return PurchaseOrderMapper.toDomain(saved);
    }

    async findAll(manager?: EntityManager): Promise<PurchaseOrderEntity[]> {
        const repo = manager ? manager.getRepository(PurchaseOrderEntityTypeOrm) : this.repository;
        const entities = await repo.find({
            relations: ['lines'], 
            order: { createdAt: 'DESC' }
        });
        return entities.map(e => PurchaseOrderMapper.toDomain(e));
    }

    async findById(id: string, manager?: EntityManager): Promise<PurchaseOrderEntity | null> {
        const repo = manager ? manager.getRepository(PurchaseOrderEntityTypeOrm) : this.repository;
        const entity = await repo.findOne({
            where: { id }, 
            relations: ['lines']
        });
        return entity ? PurchaseOrderMapper.toDomain(entity) : null;
    }

    async findByStatus(status: PurchaseOrderStatus, manager?: EntityManager): Promise<PurchaseOrderEntity[]> {
        const repo = manager ? manager.getRepository(PurchaseOrderEntityTypeOrm) : this.repository;
        const entities = await repo.find({
            where: { status }, 
            relations: ['lines'], 
            order: { createdAt: 'DESC' }
        });
        return entities.map(e => PurchaseOrderMapper.toDomain(e));
    }

    async exists(id: string, manager?: EntityManager): Promise<boolean> {
        const repo = manager ? manager.getRepository(PurchaseOrderEntityTypeOrm) : this.repository;
        return await repo.count({ where: { id } }) > 0;
    }
}
