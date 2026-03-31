import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { 
    IPurchaseOrderRepository, PURCHASE_ORDER_REPOSITORY,
    PurchaseOrderNotFoundException
} from "../../../domain";

import { GetPurchaseOrderQuery } from "./get-purchase-order.query";
import { PurchaseOrderResponseDto } from "../../dtos/purchasing.dto";

@QueryHandler(GetPurchaseOrderQuery)
export class GetPurchaseOrderHandler implements IQueryHandler<GetPurchaseOrderQuery> {
    constructor(
        @Inject(PURCHASE_ORDER_REPOSITORY)
        private readonly purchaseOrderRepo: IPurchaseOrderRepository
    ) {}

    async execute(query: GetPurchaseOrderQuery): Promise<PurchaseOrderResponseDto> {
        const purchaseOrder = await this.purchaseOrderRepo.findById(query.id);
        if (!purchaseOrder) throw new PurchaseOrderNotFoundException(query.id);
        return PurchaseOrderResponseDto.fromDomain(purchaseOrder);
    }
}
