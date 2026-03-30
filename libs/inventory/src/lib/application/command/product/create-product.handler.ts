import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { 
    IProductRepository, IProductSettingsRepository,
    PRODUCT_REPOSITORY, PRODUCT_SETTINGS_REPOSITORY,
    StockKeepingUnit, ProductSkuAlreadyExistsException,
    ProductEntity, Money
} from "../../../domain";

import { CreateProductCommand } from "./create-product.command";

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepo: IProductRepository,
        @Inject(PRODUCT_SETTINGS_REPOSITORY)
        private readonly productSettingsRepo: IProductSettingsRepository
    ) {}

    async execute(command: CreateProductCommand): Promise<string> {
        const { name, amount, currency, reorderPoint, description, barcode } = command;
        const sku = StockKeepingUnit.create(command.sku);
        const skuExists = await this.productRepo.skuExists(sku.value);

        if (skuExists) throw new ProductSkuAlreadyExistsException(sku.value);

        const product = ProductEntity.create({
            sku,
            name,
            reorderPoint,
            description,
            barcode,
            unitCost: Money.create(amount, currency),
        });

        const saved = await this.productRepo.save(product);
        await this.productSettingsRepo.save({
            id: saved.id,
            isActive: saved.isActive,
            reorderPoint: saved.reorderPoint
        });

        return saved.id;
    }
}
