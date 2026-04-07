import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";

import { 
    IProductRepository, IProductSettingsRepository,
    PRODUCT_REPOSITORY, PRODUCT_SETTINGS_REPOSITORY,
    ProductNotFoundException
} from "../../../domain";

import { ActivateProductCommand } from "./activate-product.command";

@CommandHandler(ActivateProductCommand)
export class ActivateProductHandler implements ICommandHandler<ActivateProductCommand> {
    private readonly logger = new Logger(ActivateProductHandler.name);

    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepo: IProductRepository,
        @Inject(PRODUCT_SETTINGS_REPOSITORY)
        private readonly productSettingsRepo: IProductSettingsRepository
    ) {}

    async execute(command: ActivateProductCommand): Promise<void> {
        const product = await this.productRepo.findById(command.id);
        if (!product) throw new ProductNotFoundException(command.id);

        product.activate();
        await this.productRepo.save(product);

        await this.productSettingsRepo.save({
            id: product.id,
            isActive: product.isActive,
            reorderPoint: product.reorderPoint
        });

        this.logger.log(`Product activated. User: ${command.user} | Product: ${product.id}`);
    }
}
