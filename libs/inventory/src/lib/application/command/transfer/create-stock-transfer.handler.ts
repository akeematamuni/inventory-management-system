import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";

import {
    IStockTransferRepository, STOCK_TRANSFER_REPOSITORY,
    IWarehouseRepository, WAREHOUSE_REPOSITORY,
    IProductRepository, PRODUCT_REPOSITORY,
    WarehouseNotFoundException, WarehouseInactiveException,
    IStockBalanceRepository, STOCK_BALANCE_REPOSITORY,
    ProductNotFoundException, ProductInactiveException,
    InsufficientStockException, StockTransferEntity
} from "../../../domain";

import { CreateStockTransferCommand } from "./create-stock-transfer.command";

@CommandHandler(CreateStockTransferCommand)
export class CreateStockTransferHandler implements ICommandHandler<CreateStockTransferCommand> {
    private readonly logger = new Logger(CreateStockTransferHandler.name);

    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepo: IProductRepository,
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepo: IWarehouseRepository,
        @Inject(STOCK_BALANCE_REPOSITORY)
        private readonly balanceRepo: IStockBalanceRepository,
        @Inject(STOCK_TRANSFER_REPOSITORY)
        private readonly transferRepo: IStockTransferRepository
    ) {}

    async execute(command: CreateStockTransferCommand): Promise<string> {
        const { sourceWarehouseId, destinationWarehouseId, createdBy, lines, notes } = command;
        // Guard 1: source warehouse must exist and be active
        const sourceWarehouse = await this.warehouseRepo.findById(sourceWarehouseId);
        if (!sourceWarehouse) throw new WarehouseNotFoundException(sourceWarehouseId);
        if (!sourceWarehouse.isActive) throw new WarehouseInactiveException(sourceWarehouseId);

        // Guard 2: destination warehouse must exist and be active
        const destinationWarehouse = await this.warehouseRepo.findById(destinationWarehouseId);
        if (!destinationWarehouse) throw new WarehouseNotFoundException(destinationWarehouseId);
        if (!destinationWarehouse.isActive) throw new WarehouseInactiveException(destinationWarehouseId);

        // Guard 3: Products must exist, be active, and have sufficient stock at source warehouse
        for (const line of lines) {
            const product = await this.productRepo.findById(line.productId);
            if (!product) throw new ProductNotFoundException(line.productId);
            if (!product.isActive) throw new ProductInactiveException(line.productId);

            const balance = await this.balanceRepo.findByProductAndWarehouse(
                line.productId, sourceWarehouseId
            );
            const available = balance?.quantity ?? 0;

            if (available < line.quantityRequested) throw new InsufficientStockException(
                line.productId, sourceWarehouseId, line.quantityRequested, available
            );
        }

        const transfer = StockTransferEntity.create({
            sourceWarehouseId,
            destinationWarehouseId,
            lines,
            createdBy,
            notes
        });

        const saved = await this.transferRepo.save(transfer);
        this.logger.log(`Stock transfer created. User: ${createdBy} | Transfer: ${saved.id}`);
        return saved.id;
    }
}
