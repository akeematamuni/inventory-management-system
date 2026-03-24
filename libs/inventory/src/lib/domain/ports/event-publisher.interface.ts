import { StockReceivedEvent } from "../events/stock-received.event";
import { AdjustmentCreatedEvent } from "../events/adjustment-created.event";
import { CycleCountApprovedEvent } from "../events/cycle-count-approved.event";
import { OpeningStockSetEvent } from "../events/opening-stock-set.event";
import { StockDepletedEvent } from "../events/stock-depleted.event";
import { StockTransferDispatchedEvent } from "../events/stock-transfer-dispatched.event";
import { StockTransferReceivedEvent } from "../events/stock-transfer-received.event";

export type InventoryDomainEvent =
    | StockReceivedEvent 
    | AdjustmentCreatedEvent
    | CycleCountApprovedEvent 
    | OpeningStockSetEvent
    | StockDepletedEvent 
    | StockTransferDispatchedEvent
    | StockTransferReceivedEvent;

export interface IInventoryEventPublisher {
    publish(event: InventoryDomainEvent): Promise<void>;
}

export const INVENTORY_EVENT_PUBLISHER = Symbol('INVENTORY_EVENT_PUBLISHER');
