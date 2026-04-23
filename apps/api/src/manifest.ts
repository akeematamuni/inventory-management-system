import { HttpStatus } from "@nestjs/common";
import { GlobalRegistry } from "@inventory/shared/registry";
import { GlobalErrorRegistry } from "@inventory/core";

// Import all domain errors
import {
    AdjustmentNotFoundException,
    CycleCountNotFoundException,
    CycleCountLineNotFoundException,
    CycleCountNotPendingApprovalException,
    ProductNotFoundException,
    ProductSkuAlreadyExistsException,
    ProductInactiveException,
    PurchaseOrderNotFoundException,
    PurchaseOrderLineNotFoundException,
    StockAlertNotFoundException,
    StockTransferNotFoundException,
    SameWarehouseTransferException,
    InsufficientStockException,
    StockBalanceNotFoundException,
    WarehouseNotFoundException,
    WarehouseCodeAlreadyExistsException,
    WarehouseInactiveException
} from "@inventory/inventory/domain";

// Import all entities
import { UserEntityTypeOrm } from "@inventory/user/infrastructure";
import { RefreshTokenEntityTypeOrm } from "@inventory/auth/infrastructure";
import {
    AdjustmentEntityTypeOrm,  
    ProductSettingsEntityTypeOrm,
    StockAlertEntityTypeOrm, 
    StockBalanceEntityTypeOrm, 
    StockLedgerEntryEntityTypeOrm,
    CycleCountEntityTypeOrm,
    CycleCountLineEntityTypeOrm,
    PurchaseOrderEntityTypeOrm,
    PurchaseOrderLineEntityTypeOrm,
    StockTransferEntityTypeOrm,
    StockTransferLineEntityTypeOrm, 
} from '@inventory/inventory/infrastructure';

/** Function to populate registry */
export const populateRegistry = () => {
    // Gather all classes to be registered in global registry before app start up
    GlobalErrorRegistry.addErrorMappings([
        { exception: AdjustmentNotFoundException, statusCode: HttpStatus.NOT_FOUND },
        { exception: CycleCountNotFoundException, statusCode: HttpStatus.NOT_FOUND },
        { exception: CycleCountLineNotFoundException, statusCode: HttpStatus.NOT_FOUND },
        { exception: CycleCountNotPendingApprovalException, statusCode: HttpStatus.UNPROCESSABLE_ENTITY },
        { exception: ProductNotFoundException, statusCode: HttpStatus.NOT_FOUND },
        { exception: ProductSkuAlreadyExistsException, statusCode: HttpStatus.CONFLICT },
        { exception: ProductInactiveException, statusCode: HttpStatus.UNPROCESSABLE_ENTITY },
        { exception: PurchaseOrderNotFoundException, statusCode: HttpStatus.NOT_FOUND },
        { exception: PurchaseOrderLineNotFoundException, statusCode: HttpStatus.NOT_FOUND },
        { exception: StockAlertNotFoundException, statusCode: HttpStatus.NOT_FOUND },
        { exception: StockTransferNotFoundException, statusCode: HttpStatus.NOT_FOUND },
        { exception: SameWarehouseTransferException, statusCode: HttpStatus.UNPROCESSABLE_ENTITY },
        { exception: InsufficientStockException, statusCode: HttpStatus.UNPROCESSABLE_ENTITY },
        { exception: StockBalanceNotFoundException, statusCode: HttpStatus.NOT_FOUND },
        { exception: WarehouseNotFoundException, statusCode: HttpStatus.NOT_FOUND },
        { exception: WarehouseCodeAlreadyExistsException, statusCode: HttpStatus.CONFLICT },
        { exception: WarehouseInactiveException, statusCode: HttpStatus.UNPROCESSABLE_ENTITY },
    ]);

    GlobalRegistry.addEntities([
        UserEntityTypeOrm, 
        RefreshTokenEntityTypeOrm,
        AdjustmentEntityTypeOrm,
        ProductSettingsEntityTypeOrm,
        StockAlertEntityTypeOrm,
        StockBalanceEntityTypeOrm,
        StockLedgerEntryEntityTypeOrm,
        CycleCountEntityTypeOrm,
        CycleCountLineEntityTypeOrm,
        PurchaseOrderEntityTypeOrm,
        PurchaseOrderLineEntityTypeOrm,
        StockTransferEntityTypeOrm,
        StockTransferLineEntityTypeOrm,
    ]);

    console.log("Finished polpulating global registry");
}
