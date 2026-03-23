import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

import { IStockBalanceRepository, StockBalanceEntity } from "../../../domain";
import { ProductSettingsEntityTypeOrm } from "../entities/product-settings.entity";
import { StockBalanceEntityTypeOrm } from "../entities/stock-balance.entity";
import { StockBalanceMapper } from "../mappers/stock-balance.mapper";

@Injectable()
export class StockBalanceRepositoryTypeOrm implements IStockBalanceRepository {
    constructor(
        @InjectRepository(StockBalanceEntityTypeOrm)
        private readonly repository: Repository<StockBalanceEntityTypeOrm>
    ) {}

    async save(balance: StockBalanceEntity, manager?: EntityManager): Promise<StockBalanceEntity> {
        const repo = manager ? manager.getRepository(StockBalanceEntityTypeOrm) : this.repository;
        const entity = StockBalanceMapper.toPersistence(balance);
        const saved = await repo.save(entity);
        return StockBalanceMapper.toDomain(saved);
    }

    async findAllByProduct(productId: string, manager?: EntityManager): Promise<StockBalanceEntity[]> {
        const repo = manager ? manager.getRepository(StockBalanceEntityTypeOrm) : this.repository;
        const entities = await repo.find({ where: { productId } });
        return entities.map(e => StockBalanceMapper.toDomain(e));
    }

    async findAllByWarehouse(warehouseId: string, manager?: EntityManager): Promise<StockBalanceEntity[]> {
        const repo = manager ? manager.getRepository(StockBalanceEntityTypeOrm) : this.repository;
        const entities = await repo.find({ where: { warehouseId } });
        return entities.map(e => StockBalanceMapper.toDomain(e));
    }

    async findByProductAndWarehouse(
        productId: string, warehouseId: string, manager?: EntityManager
    ): Promise<StockBalanceEntity | null> {
        const repo = manager ? manager.getRepository(StockBalanceEntityTypeOrm) : this.repository;
        const entity = await repo.findOne({ where: { productId, warehouseId } });
        return entity ? StockBalanceMapper.toDomain(entity) : null;
    }

    async findLowStock(manager?: EntityManager): Promise<StockBalanceEntity[]> {
        const repo = manager ? manager.getRepository(StockBalanceEntityTypeOrm) : this.repository;
        const entities = await repo
            .createQueryBuilder('balance')
            .innerJoin(ProductSettingsEntityTypeOrm, 'settings', 'settings.id = balance.product_id')
            .where('balance.quantity <= settings.reorder_point')
            .andWhere('settings.is_active = true')
            .orderBy('balance.quantity', 'ASC')
            .getMany();
        return entities.map(StockBalanceMapper.toDomain);
    }
}
