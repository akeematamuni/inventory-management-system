import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { IStockAlertRepository, STOCK_ALERT_REPOSITORY, StockAlertStatus } from "../../../domain";

import { GetStockAlertsQuery } from "./get-stock-alerts.query";
import { StockAlertResponseDto } from "../../dtos/reporting.dto";

@QueryHandler(GetStockAlertsQuery)
export class GetStockAlertsHandler implements IQueryHandler<GetStockAlertsQuery> {
    constructor(
        @Inject(STOCK_ALERT_REPOSITORY)
        private readonly alertRepo: IStockAlertRepository
    ) {}

    async execute(query: GetStockAlertsQuery): Promise<StockAlertResponseDto[]> {
        const { status, productId, warehouseId } = query;
        
        if (warehouseId) {
            const alerts = await this.alertRepo.findByWarehouse(warehouseId);
            return alerts.map(a => StockAlertResponseDto.fromDomain(a));
        }

        if (productId) {
            const alerts = await this.alertRepo.findByWarehouse(productId);
            return alerts.map(a => StockAlertResponseDto.fromDomain(a));
        }

        const _status = status ?? StockAlertStatus.UNRESOLVED
        const alerts = await this.alertRepo.findByStatus(_status);
        return alerts.map(a => StockAlertResponseDto.fromDomain(a));
    }
}
