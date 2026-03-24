import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IWarehouseRepository, WarehouseEntity } from "../../../domain";
import { WarehouseDocument, WarehouseEntityMongo } from "../schemas/warehouse.schema";
import { WarehouseMapper } from "../mappers/warehouse.mapper";

@Injectable()
export class WarehouseRepositoryMongo implements IWarehouseRepository {
    constructor(
        @InjectModel(WarehouseEntityMongo.name)
        private readonly model: Model<WarehouseDocument>
    ) {}

    async save(warehouse: WarehouseEntity): Promise<WarehouseEntity> {
        const data = WarehouseMapper.toPersistence(warehouse);
        const saved = await this.model.findByIdAndUpdate(
            warehouse.id, { $set: data }, { upsert: true, new: true }
        );
        return WarehouseMapper.toDomain(saved);
    }

    async findAll(): Promise<WarehouseEntity[]> {
        const data = await this.model.find().sort({ name: 1 });
        return data.map(doc => WarehouseMapper.toDomain(doc));
    }

    async findById(id: string): Promise<WarehouseEntity | null> {
        const data = await this.model.findById(id);
        return data ? WarehouseMapper.toDomain(data) : null;
    }

    async findByCode(code: string): Promise<WarehouseEntity | null> {
        const data = await this.model.findOne({ code });
        return data ? WarehouseMapper.toDomain(data) : null;
    }

    async exists(id: string): Promise<boolean> {
        return await this.model.countDocuments({ _id: id }) > 0;
    }

    async codeExists(code: string): Promise<boolean> {
        return await this.model.countDocuments({ code }) > 0;
    }
}
