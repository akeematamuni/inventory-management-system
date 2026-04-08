import { Controller, Inject, Get, Post, Patch, Param, Query, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiQuery, ApiOperation } from "@nestjs/swagger";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { ManualBody, CurrentUser } from "@inventory/core/decorators";

import {
    StockTransferResponseDto, CreateStockTransferDto, CreateStockTransferCommand,
    CreateStockTransferLine, GetStockTransferQuery, GetAllStockTransfersQuery,
    DispatchTransferCommand, ReceiveTransferCommand, ReceiveTransferLine,
    ReceiveTransferDto
} from "../../application";

import { StockTransferStatus } from "../../domain";

@ApiTags('stock-transfers')
@Controller('stock-transfers')
export class StockTransferController {
    constructor(
        @Inject(QueryBus)
        private readonly queryBus: QueryBus,
        @Inject(CommandBus)
        private readonly commandBus: CommandBus
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Creates a stock transfer request' })
    @ApiResponse({ status: 201, type: StockTransferResponseDto })
    async create(
        @CurrentUser() user: string,
        @ManualBody(CreateStockTransferDto) dto: CreateStockTransferDto
    ): Promise<StockTransferResponseDto> {
        const id = await this.commandBus.execute(new CreateStockTransferCommand(
            dto.sourceWarehouseId,
            dto.destinationWarehouseId,
            dto.lines.map(l => new CreateStockTransferLine(
                l.productId, l.quantityRequested
            )),
            user,
            dto.notes
        ));

        return await this.queryBus.execute(new GetStockTransferQuery(id));
    }

    @Patch(':id/dispatch')
    @ApiOperation({ summary: 'Dispatch pendin  transfer' })
    @ApiResponse({ status: 200, type: StockTransferResponseDto })
    async dispatch(
        @Param('id') id: string,
        @CurrentUser() user: string
    ): Promise<StockTransferResponseDto> {
        await this.commandBus.execute(new DispatchTransferCommand(
            id, user
        ));

        return await this.queryBus.execute(new GetStockTransferQuery(id));
    }

    @Patch(':id/receive')
    @ApiOperation({ summary: 'Receive dispatched transfer' })
    @ApiResponse({ status: 200, type: StockTransferResponseDto })
    async receive(
        @Param('id') id: string,
        @CurrentUser() user: string,
        @ManualBody(ReceiveTransferDto) dto: ReceiveTransferDto
    ): Promise<StockTransferResponseDto> {
        await this.commandBus.execute(new ReceiveTransferCommand(
            id,
            dto.lines.map(l => new ReceiveTransferLine(
                l.lineId, l.quantityReceived
            )),
            user
        ));

        return await this.queryBus.execute(new GetStockTransferQuery(id));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get stock transfer by ID' })
    @ApiResponse({ status: 200, type: StockTransferResponseDto })
    @ApiResponse({ status: 404, description: 'Transfer not found' })
    async get(@Param('id') id: string): Promise<StockTransferResponseDto> {
        return this.queryBus.execute(new GetStockTransferQuery(id));
    }

    @Get()
    @ApiOperation({ summary: 'Get all stock transfers' })
    @ApiQuery({ name: 'status', required: false, enum: StockTransferStatus })
    @ApiQuery({ name: 'warehouseId', required: false, type: String })
    @ApiResponse({ status: 200, type: [StockTransferResponseDto] })
    async getAll(
        @Query('status') status?: StockTransferStatus,
        @Query('warehouseId') warehouseId?: string,
    ): Promise<StockTransferResponseDto[]> {
        return this.queryBus.execute(new GetAllStockTransfersQuery(status, warehouseId));
    }
}
