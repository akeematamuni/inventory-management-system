import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { 
    IProductRepository, IProductSettingsRepository,
    PRODUCT_REPOSITORY, PRODUCT_SETTINGS_REPOSITORY,
    ProductNotFoundException
} from "../../../domain";

import { DeactivateProductCommand } from "./deactivate-product.command";

@CommandHandler(DeactivateProductCommand)
export class DeactivateProductHandler implements ICommandHandler<DeactivateProductCommand> {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepo: IProductRepository,
        @Inject(PRODUCT_SETTINGS_REPOSITORY)
        private readonly productSettingsRepo: IProductSettingsRepository
    ) {}

    async execute(command: DeactivateProductCommand): Promise<void> {
        const product = await this.productRepo.findById(command.id);
        if (!product) throw new ProductNotFoundException(command.id);

        product.deactivate();
        await this.productRepo.save(product);

        await this.productSettingsRepo.save({
            id: product.id,
            isActive: product.isActive,
            reorderPoint: product.reorderPoint
        });
    }
}
