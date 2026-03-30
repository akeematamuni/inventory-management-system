import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { IProductRepository, PRODUCT_REPOSITORY, ProductNotFoundException } from "../../../domain";
import { ProductResponseDto } from "../../dtos/product.dto";
import { GetProductQuery } from "./get-product.query";


@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<GetProductQuery> {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepo: IProductRepository
    ) {}

    async execute(query: GetProductQuery): Promise<ProductResponseDto> {
        const product = await this.productRepo.findById(query.id);
        if (!product) throw new ProductNotFoundException(query.id);
        return ProductResponseDto.fromDomain(product);
    }
}
