import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { IWarehouseRepository, WAREHOUSE_REPOSITORY } from "../../../domain";

import { WarehouseResponseDto } from "../../dtos/warehouse.dto";

import { GetAllWarehousesQuery } from "./get-all-warehouses.query";

@QueryHandler(GetAllWarehousesQuery)
export class GetAllWarehousesHandler implements IQueryHandler<GetAllWarehousesQuery> {
    constructor(
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly repository: IWarehouseRepository
    ) {}

    async execute(): Promise<WarehouseResponseDto[]> {
        const warehouses = await this.repository.findAll();
        return warehouses.map(w => WarehouseResponseDto.fromDomain(w));
    }
}
