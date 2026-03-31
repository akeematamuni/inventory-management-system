import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { IPurchaseOrderRepository, PURCHASE_ORDER_REPOSITORY } from "../../../domain";

import { GetAllPurchaseOrdersQuery } from "./get-all-purchase-orders.query";
import { PurchaseOrderResponseDto } from "../../dtos/purchasing.dto";

@QueryHandler(GetAllPurchaseOrdersQuery)
export class GetAllPurchaseOrderHandler implements IQueryHandler<GetAllPurchaseOrdersQuery> {
    constructor(
        @Inject(PURCHASE_ORDER_REPOSITORY)
        private readonly purchaseOrderRepo: IPurchaseOrderRepository
    ) {}

    async execute(query: GetAllPurchaseOrdersQuery): Promise<PurchaseOrderResponseDto[]> {
        const purchaseOrders = query.status
            ? await this.purchaseOrderRepo.findByStatus(query.status)
            : await this.purchaseOrderRepo.findAll();
        return purchaseOrders.map(po => PurchaseOrderResponseDto.fromDomain(po));
    }
}
