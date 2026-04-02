import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { IStockBalanceRepository, STOCK_BALANCE_REPOSITORY } from "../../../domain";

import { GetStockLevelsQuery } from "./get-stock-level.query";
import { StockLevelResponseDto } from "../../dtos/reporting.dto";

@QueryHandler(GetStockLevelsQuery)
export class GetStockLevelsHandler implements IQueryHandler<GetStockLevelsQuery> {
    constructor(
        @Inject(STOCK_BALANCE_REPOSITORY)
        private readonly balanceRepo: IStockBalanceRepository
    ) {}

    async execute(query: GetStockLevelsQuery): Promise<StockLevelResponseDto[]> {
        const { productId, warehouseId } = query;

        if (warehouseId) {
            const balance = await this.balanceRepo.findAllByWarehouse(warehouseId);
            return balance.map(b => StockLevelResponseDto.fromDomain(b));
        }

        if (productId) {
            const balance = await this.balanceRepo.findAllByProduct(productId);
            return balance.map(b => StockLevelResponseDto.fromDomain(b));
        }

        return [];
    }
}
