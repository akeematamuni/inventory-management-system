import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { IStockTransferRepository, STOCK_TRANSFER_REPOSITORY } from "../../../domain";

import { GetAllStockTransfersQuery } from "./get-all-stock-transfer.query";
import { StockTransferResponseDto } from "../../dtos/transfer.dto";

@QueryHandler(GetAllStockTransfersQuery)
export class GetAllStockTransfersHandler implements IQueryHandler<GetAllStockTransfersQuery> {
    constructor(
        @Inject(STOCK_TRANSFER_REPOSITORY)
        private readonly transferRepo: IStockTransferRepository
    ) {}

    async execute(query: GetAllStockTransfersQuery): Promise<StockTransferResponseDto[]> {
        const { status, warehouseId } = query;

        if (warehouseId) {
            const transfers = await this.transferRepo.findByWarehouse(warehouseId);
            return transfers.map(t => StockTransferResponseDto.fromDomain(t));
        }
        
        if (status) {
            const transfers = await this.transferRepo.findByStatus(status);
            return transfers.map(t => StockTransferResponseDto.fromDomain(t));
        }

        const transfers = await this.transferRepo.findAll();
        return transfers.map(t => StockTransferResponseDto.fromDomain(t));
    }
}
