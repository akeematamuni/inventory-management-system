import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import {
    IStockTransferRepository, 
    STOCK_TRANSFER_REPOSITORY,
    StockTransferNotFoundException
} from "../../../domain";

import { GetStockTransferQuery } from "./get-stock-transfer.query";
import { StockTransferResponseDto } from "../../dtos/transfer.dto";

@QueryHandler(GetStockTransferQuery)
export class GetStockTransferHandler implements IQueryHandler<GetStockTransferQuery> {
    constructor(
        @Inject(STOCK_TRANSFER_REPOSITORY)
        private readonly transferRepo: IStockTransferRepository
    ) {}

    async execute(query: GetStockTransferQuery): Promise<StockTransferResponseDto> {
        const transfer = await this.transferRepo.findById(query.id);
        if (!transfer) throw new StockTransferNotFoundException(query.id);
        return StockTransferResponseDto.fromDomain(transfer);
    }
}
