import { StockAlertEntity, StockAlertStatus } from '../entities/stock-alert.entity';

export interface IStockAlertRepository {
    save(alert: StockAlertEntity, manager?: unknown): Promise<StockAlertEntity>;

    findById(id: string, manager?: unknown): Promise<StockAlertEntity | null>;
    findAll(manager?: unknown): Promise<StockAlertEntity[]>;
    findByStatus(status: StockAlertStatus, manager?: unknown): Promise<StockAlertEntity[]>;
    findByProduct(productId: string, manager?: unknown): Promise<StockAlertEntity[]>;
    findByWarehouse(warehouseId: string, manager?: unknown): Promise<StockAlertEntity[]>;
    findUnresolvedByProductAndWarehouse(
        productId: string,
        warehouseId: string,
        manager?: unknown,
    ): Promise<StockAlertEntity | null>;
}

export const STOCK_ALERT_REPOSITORY = Symbol('STOCK_ALERT_REPOSITORY');
