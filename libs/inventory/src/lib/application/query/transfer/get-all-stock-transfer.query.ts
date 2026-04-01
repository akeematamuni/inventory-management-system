import { StockTransferStatus } from '../../../domain';

export class GetAllStockTransfersQuery {
    constructor(
        public readonly status?: StockTransferStatus,
        public readonly warehouseId?: string,
    ) {}
}
