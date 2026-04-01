import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { IAdjustmentRepository, ADJUSTMENT_REPOSITORY, AdjustmentNotFoundException } from "../../../domain";
import { AdjustmentResponseDto } from "../../dtos/adjustment.dto";
import { GetAdjustmentQuery } from "./get-adjustment.query";

@QueryHandler(GetAdjustmentQuery)
export class GetAdjustmentHandler implements IQueryHandler<GetAdjustmentQuery> {
    constructor(
        @Inject(ADJUSTMENT_REPOSITORY)
        private readonly adjRepo: IAdjustmentRepository,
    ) {}

    async execute(query: GetAdjustmentQuery): Promise<AdjustmentResponseDto> {
        const adjustment = await this.adjRepo.findById(query.id);
        if (!adjustment) throw new AdjustmentNotFoundException(query.id);
        return AdjustmentResponseDto.fromDomain(adjustment);
    }
}
