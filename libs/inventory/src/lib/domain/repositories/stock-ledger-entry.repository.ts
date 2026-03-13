import { StockLedgerEntryEntity } from '../entities/stock-ledger-entry.entity';
import { MovementType } from '../value-objects/movement-type.vo';

export interface StockLedgerEntryFilter {
    productId?: string;
    warehouseId?: string;
    movementType?: MovementType;
    fromDate?: Date;
    toDate?: Date;
}

export interface IStockLedgerEntryRepository {
    save(entry: StockLedgerEntryEntity, manager?: unknown): Promise<StockLedgerEntryEntity>;

    findById(id: string, manager?: unknown): Promise<StockLedgerEntryEntity | null>;
    findAll(filter?: StockLedgerEntryFilter, manager?: unknown): Promise<StockLedgerEntryEntity[]>;
}

export const STOCK_LEDGER_ENTRY_REPOSITORY = Symbol('STOCK_LEDGER_ENTRY_REPOSITORY');
