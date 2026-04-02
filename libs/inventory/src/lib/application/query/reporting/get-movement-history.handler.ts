import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { IStockLedgerEntryRepository, STOCK_LEDGER_ENTRY_REPOSITORY } from "../../../domain";

import { GetMovementHistoryQuery } from "./get-movement-history.query";
import { MovementHistoryResponseDto } from "../../dtos/reporting.dto";

@QueryHandler(GetMovementHistoryQuery)
export class GetMovementHistoryHandler implements IQueryHandler<GetMovementHistoryQuery> {
    constructor(
        @Inject(STOCK_LEDGER_ENTRY_REPOSITORY)
        private readonly ledgerRepo: IStockLedgerEntryRepository,
    ) {}

    async execute(query: GetMovementHistoryQuery): Promise<MovementHistoryResponseDto[]> {
        const entries = await this.ledgerRepo.findAll({
            productId: query.productId,
            warehouseId: query.warehouseId,
            movementType: query.movementType,
            fromDate: query.fromDate,
            toDate: query.toDate,
        });

        return entries.map(e => MovementHistoryResponseDto.fromDomain(e));
    }
}
