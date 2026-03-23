import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

import { StockLedgerEntryEntity, IStockLedgerEntryRepository, StockLedgerEntryFilter } from "../../../domain";
import { StockLedgerEntryEntityTypeOrm } from "../entities/stock-ledger-entry.entity";
import { StockLedgerEntryMapper } from "../mappers/stock-ledger-entry.mapper";

@Injectable()
export class StockLedgerEntryRepositoryTypeOrm implements IStockLedgerEntryRepository {
    constructor(
        @InjectRepository(StockLedgerEntryEntityTypeOrm)
        private readonly repository: Repository<StockLedgerEntryEntityTypeOrm>
    ) {}

    async save(entry: StockLedgerEntryEntity, manager?: EntityManager): Promise<StockLedgerEntryEntity> {
        const repo = manager ? manager.getRepository(StockLedgerEntryEntityTypeOrm) : this.repository;
        const entity = StockLedgerEntryMapper.toPersistence(entry);
        const saved = await repo.save(entity);
        return StockLedgerEntryMapper.toDomain(saved);
    }

    async findById(id: string, manager?: EntityManager): Promise<StockLedgerEntryEntity | null> {
        const repo = manager ? manager.getRepository(StockLedgerEntryEntityTypeOrm) : this.repository;
        const entity = await repo.findOne({ where: { id } });
        return entity ? StockLedgerEntryMapper.toDomain(entity) : null;
    }

    async findAll(filter?: StockLedgerEntryFilter, manager?: EntityManager): Promise<StockLedgerEntryEntity[]> {
        const repo = manager ? manager.getRepository(StockLedgerEntryEntityTypeOrm) : this.repository;
        const queryBuilder = repo.createQueryBuilder('entry');

        if (filter?.productId) {
            queryBuilder.andWhere('entry.product_id = :productId', { productId: filter.productId });
        }

        if (filter?.warehouseId) {
            queryBuilder.andWhere('entry.warehouse_id = :warehouseId', { warehouseId: filter.warehouseId });
        }

        if (filter?.movementType) {
            queryBuilder.andWhere('entry.movement_type = :movementType', { movementType: filter.movementType });
        }

        if (filter?.fromDate) {
            queryBuilder.andWhere('entry.occurred_at >= :fromDate', { fromDate: filter.fromDate });
        }

        if (filter?.toDate) {
            queryBuilder.andWhere('entry.occurred_at <= :toDate', { toDate: filter.toDate });
        }

        queryBuilder.orderBy('occurred_at', 'DESC');

        const entities = await queryBuilder.getMany();
        return entities.map(e => StockLedgerEntryMapper.toDomain(e));
    }
}
