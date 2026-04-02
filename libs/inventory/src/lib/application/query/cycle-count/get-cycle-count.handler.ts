import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { ICycleCountRepository, CYCLE_COUNT_REPOSITORY, CycleCountNotFoundException } from '../../../domain';

import { GetCycleCountQuery } from './get-cycle-count.query';
import { CycleCountResponseDto } from '../../dtos/cycle-count.dto';

@QueryHandler(GetCycleCountQuery)
export class GetCycleCountHandler implements IQueryHandler<GetCycleCountQuery> {
    constructor(
        @Inject(CYCLE_COUNT_REPOSITORY)
        private readonly cycleCountRepo: ICycleCountRepository,
    ) {}

    async execute(query: GetCycleCountQuery): Promise<CycleCountResponseDto> {
        const cycleCount = await this.cycleCountRepo.findById(query.id);
        if (!cycleCount) throw new CycleCountNotFoundException(query.id);
        return CycleCountResponseDto.fromDomain(cycleCount);
    }
}
