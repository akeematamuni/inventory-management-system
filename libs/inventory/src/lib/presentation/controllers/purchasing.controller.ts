import { Controller, Inject, Post, Get, Patch, HttpCode, HttpStatus, Param, Delete, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from "@nestjs/swagger";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { ManualBody, CurrentUser } from "@inventory/core/decorators";

import { PurchaseOrderStatus } from "../../domain";
import {
    CreatePurchaseOrderDto, PurchaseOrderResponseDto, CreatePurchaseOrderCommand,
    CreatePurchaseOrderLine, GetPurchaseOrderQuery, GetAllPurchaseOrdersQuery,
    CancelPurchaseOrderCommand, ConfirmPurchaseOrderCommand, ConfirmGoodsReceiptCommand,
    ConfirmGoodsReceiptDto, GoodsReceiptLine
} from "../../application";

@ApiTags('Purchasing')
@ApiBearerAuth()
@Controller('purchasing')
export class PurchaseController {
    constructor(
        @Inject(CommandBus) private readonly commandBus: CommandBus,
        @Inject(QueryBus) private readonly queryBus: QueryBus
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a purchase order' })
    @ApiResponse({ status: 201, type: () => PurchaseOrderResponseDto })
    async create(
        @CurrentUser() user: string,
        @ManualBody(CreatePurchaseOrderDto) dto: CreatePurchaseOrderDto
    ): Promise<PurchaseOrderResponseDto> {
        const id = await this.commandBus.execute(new CreatePurchaseOrderCommand(
            dto.warehouseId,
            dto.supplierName,
            dto.lines.map(l => new CreatePurchaseOrderLine(
                l.productId,
                l.quantityOrdered,
                l.unitCostAtOrder,
                l.currency
            )),
            user,
            dto.notes
        ));

        return await this.queryBus.execute(new GetPurchaseOrderQuery(id));
    }

    @Patch(':id/confirm')
    @ApiOperation({ summary: 'Confirm a draft purchase order' })
    @ApiResponse({ status: 200, type: () => PurchaseOrderResponseDto })
    async confirm(
        @Param('id') id: string,
        @CurrentUser() user: string
    ): Promise<PurchaseOrderResponseDto> {
        await this.commandBus.execute(new ConfirmPurchaseOrderCommand(id, user));
        return await this.queryBus.execute(new GetPurchaseOrderQuery(id));
    }

    @Patch(':id/receive')
    @ApiOperation({ summary: 'Confirm goods for a purchase order' })
    @ApiResponse({ status: 200, type: () => PurchaseOrderResponseDto })
    async confirmGoods(
        @Param('id') id: string,
        @CurrentUser() user: string,
        @ManualBody(ConfirmGoodsReceiptDto) dto: ConfirmGoodsReceiptDto
    ): Promise<PurchaseOrderResponseDto> {
        await this.commandBus.execute(new ConfirmGoodsReceiptCommand(
            id,
            dto.lines.map(l => new GoodsReceiptLine(
                l.lineId, l.quantityReceived
            )),
            user
        ));

        return await this.queryBus.execute(new GetPurchaseOrderQuery(id));
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Cancel a purchase order' })
    async cancel(
        @Param('id') id: string,
        @CurrentUser() user: string
    ): Promise<void> {
        await this.commandBus.execute(new CancelPurchaseOrderCommand(id, user));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get purchase order by ID' })
    @ApiResponse({ status: 200, type: () => PurchaseOrderResponseDto })
    @ApiResponse({ status: 404, description: 'Purchase order not found' })
    async get(@Param('id') id: string): Promise<PurchaseOrderResponseDto> {
        return await this.queryBus.execute(new GetPurchaseOrderQuery(id));
    }

    @Get()
    @ApiOperation({ summary: 'Get all purchase orders' })
    @ApiQuery({ name: 'status', required: false, enum: PurchaseOrderStatus })
    @ApiResponse({ status: 200, type: () => [PurchaseOrderResponseDto] })
    async getAll(
        @Query('status') status?: PurchaseOrderStatus,
    ): Promise<PurchaseOrderResponseDto[]> {
        return await this.queryBus.execute(new GetAllPurchaseOrdersQuery(status));
    }
}
