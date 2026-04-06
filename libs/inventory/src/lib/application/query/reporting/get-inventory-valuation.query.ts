import { ValuationMethod } from "../../dtos/reporting.dto";

export class GetInventoryValuationQuery {
    constructor(
        public readonly method: ValuationMethod,
        public readonly warehouseId?: string,
        public readonly productId?: string,
    ) {}
}
