import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { ICycleCountRepository, CYCLE_COUNT_REPOSITORY, CycleCountNotFoundException } from "../../../domain";

import { SubmitCycleCountCommand } from "./submit-cycle-count.command";

@CommandHandler(SubmitCycleCountCommand)
export class SubmitCycleCountHandler implements ICommandHandler<SubmitCycleCountCommand> {
    constructor(
        @Inject(CYCLE_COUNT_REPOSITORY)
        private readonly cycleCountRepo: ICycleCountRepository,
    ) {}

    async execute(command: SubmitCycleCountCommand): Promise<void> {
        const cycleCount = await this.cycleCountRepo.findById(command.cycleCountId);
        if (!cycleCount) throw new CycleCountNotFoundException(command.cycleCountId);

        cycleCount.submitLines(
            command.lines.map(l => ({
                lineId: l.lineId,
                countedQuantity: l.countedQuantity,
            }))
        );

        await this.cycleCountRepo.save(cycleCount);
    }
}
