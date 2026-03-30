import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { 
    IProductRepository, IProductSettingsRepository,
    PRODUCT_REPOSITORY, PRODUCT_SETTINGS_REPOSITORY,
    ProductNotFoundException, Money
} from "../../../domain";

import { UpdateProductCommand } from "./update-product.command";

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepo: IProductRepository,
        @Inject(PRODUCT_SETTINGS_REPOSITORY)
        private readonly productSettingsRepo: IProductSettingsRepository
    ) {}

    async execute(command: UpdateProductCommand): Promise<void> {
        let unitCost = undefined;
        const { id, name, amount, currency, reorderPoint, description, barcode } = command;

        const product = await this.productRepo.findById(id);
        if (!product) throw new ProductNotFoundException(id);

        if (amount && currency) {
            unitCost = Money.create(amount, currency);
        } else if (amount) {
            unitCost = Money.create(amount);
        }

        product.update({ name, description, unitCost, reorderPoint, barcode });
        await this.productRepo.save(product);

        if (reorderPoint) {
            await this.productSettingsRepo.save({
                reorderPoint,
                id: product.id,
                isActive: product.isActive
            });
        }
    }
}
