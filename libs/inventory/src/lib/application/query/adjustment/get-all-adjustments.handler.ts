import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { IAdjustmentRepository, ADJUSTMENT_REPOSITORY } from "../../../domain";
import { AdjustmentResponseDto } from "../../dtos/adjustment.dto";
import { GetAllAdjustmentsQuery } from "./get-all-adjustments.query";


@QueryHandler(GetAllAdjustmentsQuery)
export class GetAllAdjustmentsHandler implements IQueryHandler<GetAllAdjustmentsQuery> {
    constructor(
        @Inject(ADJUSTMENT_REPOSITORY)
        private readonly adjRepo: IAdjustmentRepository
    ) {}

    async execute(query: GetAllAdjustmentsQuery): Promise<AdjustmentResponseDto[]> {
        const { productId, warehouseId } = query;

        if (productId) {
            const adjustments = await this.adjRepo.findByProduct(productId);
            return adjustments.map(a => AdjustmentResponseDto.fromDomain(a));
        }

        if (warehouseId) {
            const adjustments = await this.adjRepo.findByWarehouse(warehouseId);
            return adjustments.map(a => AdjustmentResponseDto.fromDomain(a));
        }

        const adjustments = await this.adjRepo.findAll();
        return adjustments.map(a => AdjustmentResponseDto.fromDomain(a));
    }
}
