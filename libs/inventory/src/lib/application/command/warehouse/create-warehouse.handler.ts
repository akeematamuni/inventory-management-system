import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";

import {
    IWarehouseRepository, WAREHOUSE_REPOSITORY,
    WarehouseEntity,WarehouseCodeAlreadyExistsException,
} from '../../../domain';
import { CreateWarehouseCommand } from './create-warehouse.command';

@CommandHandler(CreateWarehouseCommand)
export class CreateWarehouseHandler implements ICommandHandler<CreateWarehouseCommand> {
    private logger = new Logger(CreateWarehouseHandler.name);

    constructor(
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepo: IWarehouseRepository,
    ) {}

    async execute(command: CreateWarehouseCommand): Promise<string> {
        const codeExists = await this.warehouseRepo.codeExists(command.code);
        if (codeExists) {
            throw new WarehouseCodeAlreadyExistsException(command.code);
        }

        const warehouse = WarehouseEntity.create({
            name: command.name,
            code: command.code,
            address: command.address ?? null,
        });

        const saved = await this.warehouseRepo.save(warehouse);
        this.logger.log(`New warehouse created. User: ${command.user} | Warehouse: ${saved.id}`);
        return saved.id;
    }
}
