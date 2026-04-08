import { Controller, Inject, Get, Post, Patch, Param, Query, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { ManualBody, CurrentUser } from "@inventory/core/decorators";

import { 
    CreateCycleCountDto, CycleCountResponseDto, CreateCycleCountCommand,
    ApproveCycleCountCommand, RejectCycleCountCommand, SubmitCycleCountCommand,
    GetCycleCountQuery, CreateCycleCountLine, SubmitCycleCountDto,
    GetAllCycleCountsQuery, SubmitCycleCountLine

} from "../../application";

import { CycleCountStatus } from "../../domain";

@ApiTags('cycle-counts')
@Controller('cycle-counts')
export class CycleCountController {
    constructor(
        @Inject(CommandBus) private readonly commandBus: CommandBus,
        @Inject(QueryBus) private readonly queryBus: QueryBus,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a cycle count session' })
    @ApiResponse({ status: 201, type: CycleCountResponseDto })
    async create(
        @CurrentUser() user: string,
        @ManualBody(CreateCycleCountDto) dto: CreateCycleCountDto
    ): Promise<CycleCountResponseDto> {
        const id = await this.commandBus.execute(new CreateCycleCountCommand(
            dto.warehouseId,
            dto.lines.map(l => new CreateCycleCountLine(
                l.productId, l.systemQuantity
            )),
            user,
            dto.notes,
        ));

        return await this.queryBus.execute(new GetCycleCountQuery(id));
    }

    @Patch(':id/submit')
    @ApiOperation({ summary: 'Submit counted quantities for lines' })
    @ApiResponse({ status: 200, type: CycleCountResponseDto })
    async submit(
        @Param('id') id: string,
        @CurrentUser() user: string,
        @ManualBody(SubmitCycleCountDto) dto: SubmitCycleCountDto,
    ): Promise<CycleCountResponseDto> {
        await this.commandBus.execute(new SubmitCycleCountCommand(
                id,
                dto.lines.map(l => new SubmitCycleCountLine(
                    l.lineId, l.countedQuantity
                )),
                user,
            )
        );
        return await this.queryBus.execute(new GetCycleCountQuery(id));
    }

    @Patch(':id/approve')
    @ApiOperation({ summary: 'Approve a cycle count' })
    @ApiResponse({ status: 200, type: CycleCountResponseDto })
    async approve(
        @Param('id') id: string,
        @CurrentUser() user: string
    ): Promise<CycleCountResponseDto> {
        await this.commandBus.execute(new ApproveCycleCountCommand(id, user));
        return await this.queryBus.execute(new GetCycleCountQuery(id));
    }

    @Patch(':id/reject')
    @ApiOperation({ summary: 'Reject a cycle count' })
    @ApiResponse({ status: 200, type: CycleCountResponseDto })
    async reject(
        @Param('id') id: string,
        @CurrentUser() user: string
    ): Promise<CycleCountResponseDto> {
        await this.commandBus.execute(new RejectCycleCountCommand(id, user));
        return await this.queryBus.execute(new GetCycleCountQuery(id));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get cycle count by ID' })
    @ApiResponse({ status: 200, type: CycleCountResponseDto })
    @ApiResponse({ status: 404, description: 'Cycle count not found' })
    async get(@Param('id') id: string): Promise<CycleCountResponseDto> {
        return await this.queryBus.execute(new GetCycleCountQuery(id));
    }

    @Get()
    @ApiOperation({ summary: 'Get all cycle counts' })
    @ApiQuery({ name: 'warehouseId', required: false, type: String })
    @ApiQuery({ name: 'status', required: false, enum: CycleCountStatus })
    @ApiResponse({ status: 200, type: [CycleCountResponseDto] })
    async getAll(
        @Query('warehouseId') warehouseId?: string,
        @Query('status') status?: CycleCountStatus,
    ): Promise<CycleCountResponseDto[]> {
        return await this.queryBus.execute(new GetAllCycleCountsQuery(warehouseId, status));
    }
}
