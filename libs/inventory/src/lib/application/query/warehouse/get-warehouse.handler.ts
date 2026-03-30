import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import {
    IWarehouseRepository, WAREHOUSE_REPOSITORY, WarehouseNotFoundException
} from "../../../domain";

import { WarehouseResponseDto } from "../../dtos/warehouse.dto";

import { GetWarehouseQuery, GetWarehouseByCodeQuery } from "./get-warehouse.query";

@QueryHandler(GetWarehouseQuery)
export class GetWarehouseHandler implements IQueryHandler<GetWarehouseQuery> {
    constructor(
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly repository: IWarehouseRepository
    ) {}

    async execute(query: GetWarehouseQuery): Promise<WarehouseResponseDto> {
        const warehouse = await this.repository.findById(query.id);
        if (!warehouse) throw new WarehouseNotFoundException(query.id);
        return WarehouseResponseDto.fromDomain(warehouse);
    }
}

@QueryHandler(GetWarehouseQuery)
export class GetWarehouseByCodeHandler implements IQueryHandler<GetWarehouseByCodeQuery> {
    constructor(
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly repository: IWarehouseRepository
    ) {}

    async execute(query: GetWarehouseByCodeQuery): Promise<WarehouseResponseDto> {
        const warehouse = await this.repository.findByCode(query.code);
        if (!warehouse) throw new WarehouseNotFoundException(query.code);
        return WarehouseResponseDto.fromDomain(warehouse);
    }
}
