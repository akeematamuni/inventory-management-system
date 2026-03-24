import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IProductRepository, ProductEntity } from "../../../domain";
import { ProductEntityMongo, ProductDocument } from "../schemas/product.schema";
import { ProductMapper } from "../mappers/product.mapper";

@Injectable()
export class ProductRepositoryMongo implements IProductRepository {
    constructor(
        @InjectModel(ProductEntityMongo.name)
        private readonly model: Model<ProductDocument>
    ) {}

    async save(product: ProductEntity): Promise<ProductEntity> {
        const data = ProductMapper.toPersistence(product);
        const saved = await this.model.findByIdAndUpdate(
            product.id, { $set: data }, { upsert: true, new: true }
        );
        return ProductMapper.toDomain(saved);
    }

    async findAll(): Promise<ProductEntity[]> {
        const data = await this.model.find().sort({ name: 1 });
        return data.map(doc => ProductMapper.toDomain(doc));
    }

    async findById(id: string): Promise<ProductEntity | null> {
        const data = await this.model.findById(id);
        return data ? ProductMapper.toDomain(data) : null;
    }

    async findByBarcode(barcode: string): Promise<ProductEntity | null> {
        const data = await this.model.findOne({ barcode });
        return data ? ProductMapper.toDomain(data) : null;
    }

    async findBySku(sku: string): Promise<ProductEntity | null> {
        const data = await this.model.findOne({ sku });
        return data ? ProductMapper.toDomain(data) : null;
    }

    async exists(id: string): Promise<boolean> {
        return await this.model.countDocuments({ _id: id }) > 0;
    }

    async skuExists(sku: string): Promise<boolean> {
        return await this.model.countDocuments({ sku }) > 0;
    }
}
