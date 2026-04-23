import { Controller, Get, Post, Param, Query, HttpCode, HttpStatus, Inject } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth, ApiBody, ApiParam } from "@nestjs/swagger";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { ManualBody, CurrentUser } from "@inventory/core/decorators";

import {
    CreateAdjustmentDto, AdjustmentResponseDto, CreateAdjustmentCommand,
    GetAdjustmentQuery, GetAllAdjustmentsQuery
} from "../../application";

@ApiTags('Adjustments')
@ApiBearerAuth()
@Controller('adjustments')
export class AdjustmentController {
    constructor(
        @Inject(QueryBus)
        private readonly queryBus: QueryBus,
        @Inject(CommandBus)
        private readonly commandBus: CommandBus,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({ type: () => CreateAdjustmentDto })
    @ApiOperation({ summary: 'Create a manual stock adjustment' })
    @ApiResponse({ status: 201, type: () => AdjustmentResponseDto })
    async create(
        @CurrentUser() user: string,
        @ManualBody(CreateAdjustmentDto) dto: CreateAdjustmentDto,
    ): Promise<AdjustmentResponseDto> {
        const id = await this.commandBus.execute(new CreateAdjustmentCommand(
            dto.productId,
            dto.warehouseId,
            dto.quantity,
            dto.movementType,
            dto.reasonCode,
            user,
            dto.notes,
            dto.reasonNotes,
        ));

        return this.queryBus.execute(new GetAdjustmentQuery(id));
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: String })
    @ApiOperation({ summary: 'Get adjustment by ID' })
    @ApiResponse({ status: 200, type: () => AdjustmentResponseDto })
    @ApiResponse({ status: 404, description: 'Adjustment not found' })
    async get(@Param('id') id: string): Promise<AdjustmentResponseDto> {
        return await this.queryBus.execute(new GetAdjustmentQuery(id));
    }

    @Get()
    @ApiOperation({ summary: 'Get all adjustments' })
    @ApiQuery({ name: 'productId', required: false, type: String })
    @ApiQuery({ name: 'warehouseId', required: false, type: String })
    @ApiResponse({ status: 200, type: () => [AdjustmentResponseDto] })
    async getAll(
        @Query('productId') productId?: string,
        @Query('warehouseId') warehouseId?: string,
    ): Promise<AdjustmentResponseDto[]> {
        return await this.queryBus.execute(new GetAllAdjustmentsQuery(productId, warehouseId));
    }
}
