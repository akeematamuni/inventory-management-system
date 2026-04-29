import { Controller, Inject, Post, Get, Patch, HttpCode, HttpStatus, Param, Delete, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth, ApiBody, ApiParam } from "@nestjs/swagger";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { ManualBody, CurrentUser } from "@inventory/core/decorators";

import {
    CreateProductDto, UpdateProductDto, ProductResponseDto,
    CreateProductCommand, UpdateProductCommand, GetProductQuery,
    GetAllProductsQuery, ActivateProductCommand, DeactivateProductCommand
} from "../../application";

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
    constructor(
        @Inject(CommandBus)
        private readonly commandBus: CommandBus,
        @Inject(QueryBus)
        private readonly queryBus: QueryBus
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({ type: () => CreateProductDto })
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, type: () => ProductResponseDto })
    @ApiResponse({ status: 409, description: 'SKU already exists' })
    async create(
        @CurrentUser() user: string,
        @ManualBody(CreateProductDto) dto: CreateProductDto
    ): Promise<ProductResponseDto> {
        const id = await this.commandBus.execute(new CreateProductCommand(
            dto.name,
            dto.sku,
            dto.amount,
            dto.currency,
            dto.reorderPoint,
            dto.description,
            dto.barcode,
            user
        ));

        return await this.queryBus.execute(new GetProductQuery(id));
    }

    @Patch(':id')
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: () => UpdateProductDto })
    @ApiOperation({ summary: 'Update product details' })
    @ApiResponse({ status: 200, type: () => ProductResponseDto })
    async update(
        @Param('id') id: string,
        @CurrentUser() user: string,
        @ManualBody(UpdateProductDto) dto: UpdateProductDto
    ): Promise<ProductResponseDto> {
        await this.commandBus.execute(new UpdateProductCommand(
            id,
            dto.name,
            dto.amount,
            dto.currency,
            dto.reorderPoint,
            dto.description,
            dto.barcode,
            user
        ));

        return await this.queryBus.execute(new GetProductQuery(id));
    }

    @Patch('activate/:id')
    @ApiParam({ name: 'id', type: String })
    @ApiOperation({ summary: 'Reactivate a deactivated product' })
    @ApiResponse({ status: 200, type: () => ProductResponseDto })
    async activate(
        @Param('id') id: string,
        @CurrentUser() user: string
    ): Promise<ProductResponseDto> {
        await this.commandBus.execute(new ActivateProductCommand(id, user));
        return await this.queryBus.execute(new GetProductQuery(id));
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiParam({ name: 'id', type: String })
    @ApiOperation({ summary: 'Deactivated a product' })
    async deactivate(
        @Param('id') id: string,
        @CurrentUser() user: string
    ): Promise<void> {
        await this.commandBus.execute(new DeactivateProductCommand(id, user));
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: String })
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({ status: 200, type: () => ProductResponseDto })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async get(@Param('id') id: string): Promise<ProductResponseDto> {
        return await this.queryBus.execute(new GetProductQuery(id));
    }

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiResponse({ status: 200, type: () => [ProductResponseDto] })
    async getAll(
        @Query('activeOnly') activeOnly?: string,
        @Query('search') search?: string,
    ): Promise<ProductResponseDto[]> {
        return await this.queryBus.execute(new GetAllProductsQuery(
            activeOnly === 'true' ? true : undefined,
            search,
        ));
    }
}
