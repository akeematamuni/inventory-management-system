import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";

import { ICycleCountRepository, CYCLE_COUNT_REPOSITORY, CycleCountNotFoundException } from "../../../domain";

import { SubmitCycleCountCommand } from "./submit-cycle-count.command";

@CommandHandler(SubmitCycleCountCommand)
export class SubmitCycleCountHandler implements ICommandHandler<SubmitCycleCountCommand> {
    private readonly logger = new Logger(SubmitCycleCountHandler.name);

    constructor(
        @Inject(CYCLE_COUNT_REPOSITORY)
        private readonly cycleCountRepo: ICycleCountRepository,
    ) {}

    async execute(command: SubmitCycleCountCommand): Promise<void> {
        const { cycleCountId, lines, performedBy } = command;
        const cycleCount = await this.cycleCountRepo.findById(cycleCountId);
        if (!cycleCount) throw new CycleCountNotFoundException(cycleCountId);

        cycleCount.submitLines(
            lines.map(l => ({
                lineId: l.lineId,
                countedQuantity: l.countedQuantity,
            }))
        );

        await this.cycleCountRepo.save(cycleCount);
        this.logger.log(`Cycle count submitted. User: ${performedBy} | Cycle-Count: ${cycleCountId}`);
    }
}
