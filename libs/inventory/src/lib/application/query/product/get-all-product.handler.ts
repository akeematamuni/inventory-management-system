import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { IProductRepository, PRODUCT_REPOSITORY } from "../../../domain";
import { ProductResponseDto } from "../../dtos/product.dto";
import { GetAllProductsQuery } from "./get-all-product.query";


@QueryHandler(GetAllProductsQuery)
export class GetProductHandler implements IQueryHandler<GetAllProductsQuery> {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepo: IProductRepository
    ) {}

    async execute(query: GetAllProductsQuery): Promise<ProductResponseDto[]> {
        const products = await this.productRepo.findAll();
        const { activeOnly, search } = query;

        // Run an in-memory filteing, only with few thousands product
        const filtered = products.filter(p => {
            if (activeOnly && !p.isActive) return false;
            if (search) {
                const sl = search.toLowerCase();
                return p.name.toLowerCase().includes(sl) || p.sku.value.toLowerCase().includes(sl);
            }
            return true;
        });

        return filtered.map(product => ProductResponseDto.fromDomain(product));
    }
}
