import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import {
    IWarehouseRepository, WAREHOUSE_REPOSITORY,
    WarehouseNotFoundException
} from "../../../domain";

import { UpdateWarehouseCommand } from "./update-warehouse.command";

@CommandHandler(UpdateWarehouseCommand)
export class UpdateWarehouseHandler implements ICommandHandler<UpdateWarehouseCommand> {
    constructor(
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly repository: IWarehouseRepository
    ) {}

    async execute(command: UpdateWarehouseCommand): Promise<void> {
        const warehouse = await this.repository.findById(command.id);
        if (!warehouse) throw new WarehouseNotFoundException(command.id);

        warehouse.update(command.name, command.address);
        await this.repository.save(warehouse);
    }
}
