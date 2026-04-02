import { MovementType } from '../../../domain';

export class GetMovementHistoryQuery {
    constructor(
        public readonly productId?: string,
        public readonly warehouseId?: string,
        public readonly movementType?: MovementType,
        public readonly fromDate?: Date,
        public readonly toDate?: Date,
    ) {}
}
