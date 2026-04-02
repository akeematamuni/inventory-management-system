import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { ICycleCountRepository, CYCLE_COUNT_REPOSITORY } from "../../../domain";

import { GetAllCycleCountsQuery } from "./get-all-cycle-count.query";
import { CycleCountResponseDto } from '../../dtos/cycle-count.dto';

@QueryHandler(GetAllCycleCountsQuery)
export class GetAllCycleCountsHandler implements IQueryHandler<GetAllCycleCountsQuery> {
    constructor(
        @Inject(CYCLE_COUNT_REPOSITORY)
        private readonly cycleCountRepo: ICycleCountRepository,
    ) {}

    async execute(query: GetAllCycleCountsQuery): Promise<CycleCountResponseDto[]> {
        if (query.warehouseId) {
            const counts = await this.cycleCountRepo.findByWarehouse(query.warehouseId);
            return counts.map(c => CycleCountResponseDto.fromDomain(c));
        }

        if (query.status) {
            const counts = await this.cycleCountRepo.findByStatus(query.status);
            return counts.map(c => CycleCountResponseDto.fromDomain(c));
        }

        const counts = await this.cycleCountRepo.findAll();
        return counts.map(c => CycleCountResponseDto.fromDomain(c));
    }
}
