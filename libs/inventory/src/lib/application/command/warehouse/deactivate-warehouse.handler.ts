import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import {
    IWarehouseRepository, WAREHOUSE_REPOSITORY,
    WarehouseNotFoundException, WarehouseInactiveException
} from "../../../domain";

import { DeactivateWarehouseCommand } from "./deactivate-warehouse.command";

@CommandHandler(DeactivateWarehouseCommand)
export class DeactivateWarehouseHandler implements ICommandHandler<DeactivateWarehouseCommand> {
    constructor(
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly repository: IWarehouseRepository
    ) {}

    async execute(command: DeactivateWarehouseCommand): Promise<void> {
        const warehouse = await this.repository.findById(command.id);

        if (!warehouse) throw new WarehouseNotFoundException(command.id);
        if (!warehouse.isActive) throw new WarehouseInactiveException(command.id);

        warehouse.deactivate()
        await this.repository.save(warehouse);
    }
}
