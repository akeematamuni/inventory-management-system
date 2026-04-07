import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";

import {
    IWarehouseRepository, WAREHOUSE_REPOSITORY,
    IProductRepository, PRODUCT_REPOSITORY,
    IStockBalanceRepository, STOCK_BALANCE_REPOSITORY,
    WarehouseNotFoundException, WarehouseInactiveException,
    ProductNotFoundException, ProductInactiveException,
    IInventoryEventPublisher, INVENTORY_EVENT_PUBLISHER,
    OpeningStockSetEvent
} from '../../../domain';

import { SetOpeningStockCommand } from './set-opening-stock.command';

@CommandHandler(SetOpeningStockCommand)
export class SetOpeningStockHandler implements ICommandHandler<SetOpeningStockCommand> {
    private readonly logger = new Logger(SetOpeningStockHandler.name);

    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepo: IProductRepository,
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepo: IWarehouseRepository,
        @Inject(STOCK_BALANCE_REPOSITORY)
        private readonly balanceRepo: IStockBalanceRepository,
        @Inject(INVENTORY_EVENT_PUBLISHER)
        private readonly publisher: IInventoryEventPublisher,
    ) {}

    async execute(command: SetOpeningStockCommand): Promise<void> {
        const { warehouseId, productId, performedBy, quantity, unitCost, currency } = command;

        // Guard 1: warehouse must exist and be active
        const warehouse = await this.warehouseRepo.findById(warehouseId);
        if (!warehouse) throw new WarehouseNotFoundException(warehouseId);
        if (!warehouse.isActive) throw new WarehouseInactiveException(warehouseId);

        // Guard 2: product must exist and be active
        const product = await this.productRepo.findById(command.productId);
        if (!product) throw new ProductNotFoundException(command.productId);
        if (!product.isActive) throw new ProductInactiveException(command.productId);

        // Guard 3: can only set opening stock when no balance exists yet
        const exists = await this.balanceRepo.findByProductAndWarehouse(productId, warehouseId);
        if (exists) throw new Error(`Product has balance in this warehouse. Use adjustment instead.`);

        this.logger.log(
            `
            Opening stock has been set for Product: ${productId}, 
            In Warehouse: ${warehouseId}, PerformedBy: ${performedBy},
            Quantity: ${quantity}.
            `
        );
        
        await this.publisher.publish(new OpeningStockSetEvent(
            productId,
            warehouseId,
            quantity,
            performedBy,
            new Date(),
            unitCost,
            currency
        ));
    }
}
