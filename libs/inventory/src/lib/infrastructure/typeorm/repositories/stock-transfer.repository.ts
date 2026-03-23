import { Injectable } from "@nestjs/common"; 
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

import { IStockTransferRepository, StockTransferEntity, StockTransferStatus } from "../../../domain";
import { StockTransferEntityTypeOrm } from "../entities/stock-transfer.entity";
import { StockTransferMapper } from "../mappers/stock-transfer.mapper";

@Injectable()
export class StockTransferRepositoryTypeOrm implements IStockTransferRepository {
    constructor(
        @InjectRepository(StockTransferEntityTypeOrm)
        private readonly repository: Repository<StockTransferEntityTypeOrm>
    ) {}

    async save(transfer: StockTransferEntity, manager?: EntityManager): Promise<StockTransferEntity> {
        const repo = manager ? manager.getRepository(StockTransferEntityTypeOrm) : this.repository;
        const entity = StockTransferMapper.toPersistence(transfer);
        const saved = await repo.save(entity);
        return StockTransferMapper.toDomain(saved);
    }

    async findAll(manager?: EntityManager): Promise<StockTransferEntity[]> {
        const repo = manager ? manager.getRepository(StockTransferEntityTypeOrm) : this.repository;
        const entities = await repo.find({
            relations: ['lines'],
            order: { createdAt: 'DESC' }
        });
        return entities.map(e => StockTransferMapper.toDomain(e));
    }

    async findById(id: string, manager?: EntityManager): Promise<StockTransferEntity | null> {
        const repo = manager ? manager.getRepository(StockTransferEntityTypeOrm) : this.repository;
        const entity = await repo.findOne({
            where: { id },
            relations: ['lines']
        });
        return entity ? StockTransferMapper.toDomain(entity) : null;
    }

    async findByStatus(status: StockTransferStatus, manager?: EntityManager): Promise<StockTransferEntity[]> {
        const repo = manager ? manager.getRepository(StockTransferEntityTypeOrm) : this.repository;
        const entities = await repo.find({
            where: { status },
            relations: ['lines'],
            order: { createdAt: 'DESC' }
        });
        return entities.map(e => StockTransferMapper.toDomain(e));
    }

    async findByWarehouse(warehouseId: string, manager?: EntityManager): Promise<StockTransferEntity[]> {
        const repo = manager ? manager.getRepository(StockTransferEntityTypeOrm) : this.repository;
        const entities = await repo
            .createQueryBuilder('transfer')
            .leftJoinAndSelect('transfer.lines', 'lines')
            .where('transfer.source_warehouse_id = :warehouseId', { warehouseId })
            .orWhere('transfer.destination_warehouse_id = :warehouseId', { warehouseId })
            .orderBy('transfer.created_at', 'DESC')
            .getMany()
        return entities.map(e => StockTransferMapper.toDomain(e));
    }

    async exists(id: string, manager?: EntityManager): Promise<boolean> {
        const repo = manager ? manager.getRepository(StockTransferEntityTypeOrm) : this.repository;
        return await repo.count({ where: { id } }) > 0;
    }
}
