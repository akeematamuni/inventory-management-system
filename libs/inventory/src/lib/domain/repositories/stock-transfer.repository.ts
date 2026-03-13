import { StockTransferEntity, StockTransferStatus } from '../entities/stock-transfer.entity';

export interface IStockTransferRepository {
    save(transfer: StockTransferEntity, manager?: unknown): Promise<StockTransferEntity>;

    findById(id: string, manager?: unknown): Promise<StockTransferEntity | null>;
    findAll(manager?: unknown): Promise<StockTransferEntity[]>;
    findByStatus(status: StockTransferStatus, manager?: unknown): Promise<StockTransferEntity[]>;
    findByWarehouse(warehouseId: string, manager?: unknown): Promise<StockTransferEntity[]>;

    exists(id: string, manager?: unknown): Promise<boolean>;
}

export const STOCK_TRANSFER_REPOSITORY = Symbol('STOCK_TRANSFER_REPOSITORY');
