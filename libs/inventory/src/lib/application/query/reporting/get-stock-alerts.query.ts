import { StockAlertStatus } from '../../../domain';

export class GetStockAlertsQuery {
    constructor(
        public readonly status?: StockAlertStatus,
        public readonly warehouseId?: string,
        public readonly productId?: string,
    ) {}
}
