import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";

import { ICycleCountRepository, CYCLE_COUNT_REPOSITORY, CycleCountNotFoundException } from "../../../domain";

import { RejectCycleCountCommand } from "./reject-cycle-count.command";

@CommandHandler(RejectCycleCountCommand)
export class RejectCycleCountHandler implements ICommandHandler<RejectCycleCountCommand> {
    private readonly logger = new Logger(RejectCycleCountHandler.name);

    constructor(
        @Inject(CYCLE_COUNT_REPOSITORY)
        private readonly cycleCountRepo: ICycleCountRepository
    ) {}

    async execute(command: RejectCycleCountCommand): Promise<void> {
        const { cycleCountId, rejectedBy } = command;

        const cycleCount = await this.cycleCountRepo.findById(cycleCountId);
        if (!cycleCount) throw new CycleCountNotFoundException(cycleCountId);

        cycleCount.reject();

        await this.cycleCountRepo.save(cycleCount);
        this.logger.log(`Cycle count rejected. User: ${rejectedBy} | Cycle-Count: ${cycleCountId}`);
    }
}
