import { Injectable, Inject } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { IInventoryEventPublisher, InventoryDomainEvent } from "../../../domain";

@Injectable()
export class InventoryPublisherEmitter implements IInventoryEventPublisher{
    constructor(
        @Inject(EventEmitter2)
        private readonly eventEmitter: EventEmitter2
    ) {}

    async publish(event: InventoryDomainEvent): Promise<void> {
        this.eventEmitter.emit(event.constructor.name, event);
    }
}
