import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import {
    IPurchaseOrderRepository, PURCHASE_ORDER_REPOSITORY,
    IWarehouseRepository, WAREHOUSE_REPOSITORY,
    IProductRepository, PRODUCT_REPOSITORY,
    WarehouseNotFoundException, WarehouseInactiveException,
    ProductNotFoundException, ProductInactiveException,
    PurchaseOrderEntity
} from '../../../domain';

import { CreatePurchaseOrderCommand } from './create-purchase-order.command';

@CommandHandler(CreatePurchaseOrderCommand)
export class CreatePurchaseOrderHandler implements ICommandHandler<CreatePurchaseOrderCommand> {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepo: IProductRepository,
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepo: IWarehouseRepository,
        @Inject(PURCHASE_ORDER_REPOSITORY)
        private readonly purchaseOrderRepo: IPurchaseOrderRepository
    ) {}

    async execute(command: CreatePurchaseOrderCommand): Promise<string> {
        const { warehouseId, supplierName, lines, createdBy, notes } = command;

        // Guard 1: Check first for warehouse
        const warehouse = await this.warehouseRepo.findById(warehouseId);
        if (!warehouse) {
            throw new WarehouseNotFoundException(warehouseId);
        }
        if (!warehouse.isActive) {
            throw new WarehouseInactiveException(warehouseId);
        }

        // Guard 2: Confirm products exists and are active
        for (const line of lines) {
            const product = await this.productRepo.findById(line.productId);
            if (!product) {
                throw new ProductNotFoundException(line.productId);
            }
            if (!product.isActive) {
                throw new ProductInactiveException(line.productId);
            }
        }

        const purchaseOrder = PurchaseOrderEntity.create({
            warehouseId,
            supplierName,
            notes,
            createdBy,
            lines: lines.map(line => ({
                productId: line.productId,
                quantityOrdered: line.quantityOrdered,
                unitCostAtOrder: line.unitCostAtOrder,
                currency: line.currency,
            })),
        });

        const saved = await this.purchaseOrderRepo.save(purchaseOrder);
        return saved.id;
    }
}
