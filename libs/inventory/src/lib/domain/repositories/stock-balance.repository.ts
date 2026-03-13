import { StockBalanceEntity } from '../entities/stock-balance.entity';

export interface IStockBalanceRepository {
    save(balance: StockBalanceEntity, manager?: unknown): Promise<StockBalanceEntity>;

    findAllByWarehouse(warehouseId: string, manager?: unknown): Promise<StockBalanceEntity[]>;
    findAllByProduct(productId: string, manager?: unknown): Promise<StockBalanceEntity[]>;
    findLowStock(manager?: unknown): Promise<StockBalanceEntity[]>;

    findByProductAndWarehouse(
        productId: string, warehouseId: string, manager?: unknown
    ): Promise<StockBalanceEntity | null>;
}

export const STOCK_BALANCE_REPOSITORY = Symbol('STOCK_BALANCE_REPOSITORY');
