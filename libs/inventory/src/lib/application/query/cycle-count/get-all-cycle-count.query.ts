import { CycleCountStatus } from '../../../domain';

export class GetAllCycleCountsQuery {
    constructor(
        public readonly warehouseId?: string,
        public readonly status?: CycleCountStatus,
    ) {}
}
