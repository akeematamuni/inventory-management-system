import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { IProductSettingsRepository, ProductSettings } from '../../../domain';
import { ProductSettingsEntityTypeOrm } from '../entities/product-settings.entity';

@Injectable()
export class ProductSettingsRepository implements IProductSettingsRepository {
    constructor(
        @InjectRepository(ProductSettingsEntityTypeOrm)
        private readonly repository: Repository<ProductSettingsEntityTypeOrm>
    ) {}

    async save(data: ProductSettings, manager?: EntityManager): Promise<ProductSettings> {
        const repo = manager ? manager.getRepository(ProductSettingsEntityTypeOrm) : this.repository;

        const entity = new ProductSettingsEntityTypeOrm();
        entity.id = data.id;
        entity.isActive = data.isActive;
        entity.reorderPoint = data.reorderPoint;
        
        const saved = await repo.save(entity);

        return {
            id: saved.id,
            reorderPoint: saved.reorderPoint,
            isActive: saved.isActive
        }
    }

    async findById(id: string, manager?: EntityManager): Promise<ProductSettings | null> {
        const repo = manager ? manager.getRepository(ProductSettingsEntityTypeOrm) : this.repository;
        const entity = await repo.findOne({ where: { id } });
        return entity ? { id: entity.id, reorderPoint: entity.reorderPoint, isActive: entity.isActive} : null;
    }
}
