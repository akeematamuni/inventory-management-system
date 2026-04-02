import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { 
    ICycleCountRepository, CYCLE_COUNT_REPOSITORY, CycleCountNotFoundException
} from "../../../domain";

import { RejectCycleCountCommand } from "./reject-cycle-count.command";

@CommandHandler(RejectCycleCountCommand)
export class RejectCycleCountHandler implements ICommandHandler<RejectCycleCountCommand> {
    constructor(
        @Inject(CYCLE_COUNT_REPOSITORY)
        private readonly cycleCountRepo: ICycleCountRepository
    ) {}

    async execute(command: RejectCycleCountCommand): Promise<void> {
        const { cycleCountId } = command;

        const cycleCount = await this.cycleCountRepo.findById(cycleCountId);
        if (!cycleCount) throw new CycleCountNotFoundException(cycleCountId);

        cycleCount.reject();

        await this.cycleCountRepo.save(cycleCount);
    }
}
