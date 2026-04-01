import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { 
    ICycleCountRepository, CYCLE_COUNT_REPOSITORY,
    CycleCountNotFoundException, IInventoryEventPublisher,
    INVENTORY_EVENT_PUBLISHER, CycleCountApprovedEvent
} from "../../../domain";

import { ApproveCycleCountCommand } from "./approve-cycle-count.command";

@CommandHandler(ApproveCycleCountCommand)
export class ApproveCycleCountHandler implements ICommandHandler<ApproveCycleCountCommand> {
    constructor(
        @Inject(INVENTORY_EVENT_PUBLISHER)
        private readonly publisher: IInventoryEventPublisher,
        @Inject(CYCLE_COUNT_REPOSITORY)
        private readonly cycleCountRepo: ICycleCountRepository
    ) {}

    async execute(command: ApproveCycleCountCommand): Promise<void> {
        const { cycleCountId, approvedBy } = command;

        const cycleCount = await this.cycleCountRepo.findById(cycleCountId);
        if (!cycleCount) throw new CycleCountNotFoundException(cycleCountId);

        const varianceLines = cycleCount.approve(approvedBy);

        await this.cycleCountRepo.save(cycleCount);

        if (varianceLines.length > 0) {
            await this.publisher.publish(new CycleCountApprovedEvent(
                cycleCount.id,
                cycleCount.warehouseId,
                approvedBy,
                new Date(),
                varianceLines.map(l => ({
                    productId: l.productId,
                    variance: l.variance()
                }))
            ));
        }
    }
}
