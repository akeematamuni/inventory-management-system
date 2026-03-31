import { PurchaseOrderStatus } from '../../../domain';

export class GetAllPurchaseOrdersQuery {
    constructor(
        public readonly status?: PurchaseOrderStatus,
    ) {}
}
