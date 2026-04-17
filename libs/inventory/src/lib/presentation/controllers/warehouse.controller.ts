import { Controller, Inject, Post, Get, Patch, HttpCode, HttpStatus, Param, Delete } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from "@nestjs/swagger";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { ManualBody, CurrentUser } from "@inventory/core/decorators";

import { 
    WarehouseResponseDto, CreateWarehouseDto, UpdateWarehouseDto,
    CreateWarehouseCommand, GetWarehouseQuery, UpdateWarehouseCommand,
    GetAllWarehousesQuery, DeactivateWarehouseCommand
} from "../../application";

@ApiTags('Warehouses')
@ApiBearerAuth()
@Controller('warehouses')
export class WarehouseController {
    constructor(
        @Inject(CommandBus)
        private readonly commandBus: CommandBus,
        @Inject(QueryBus)
        private readonly queryBus: QueryBus       
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new warehouse' })
    @ApiResponse({ status: 201, type: WarehouseResponseDto })
    @ApiResponse({ status: 409, description: 'Warehouse code already exists' })
    async create(
        @CurrentUser() user: string,
        @ManualBody(CreateWarehouseDto) dto: CreateWarehouseDto
    ): Promise<WarehouseResponseDto> {
        const id = await this.commandBus.execute(
            new CreateWarehouseCommand(
            dto.name, 
            dto.code, 
            dto.address,
            user
        ));

        return await this.queryBus.execute(new GetWarehouseQuery(id));
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update warehouse name or address' })
    @ApiResponse({ status: 200, type: WarehouseResponseDto })
    async update(
        @Param('id') id: string,
        @CurrentUser() user: string,
        @ManualBody(UpdateWarehouseDto) dto: UpdateWarehouseDto
    ): Promise<WarehouseResponseDto> {
        const _id = await this.commandBus.execute(new UpdateWarehouseCommand(
            id, 
            dto.name, 
            dto.address,
            user
        ));

        return await this.queryBus.execute(new GetWarehouseQuery(_id));
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Deactivate a warehouse' })
    @ApiResponse({ status: 204, description: 'Warehouse deactivated' })
    async deactivate(
        @Param('id') id: string,
        @CurrentUser() user: string
    ): Promise<void> {
        await this.commandBus.execute(new DeactivateWarehouseCommand(id, user));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get warehouse using ID' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, type: WarehouseResponseDto })
    @ApiResponse({ status: 404, description: 'Warehouse not found' })
    async get(@Param('id') id: string): Promise<WarehouseResponseDto> {
        return await this.queryBus.execute(new GetWarehouseQuery(id));
    }

    @Get()
    @ApiOperation({ summary: 'Get all warehouses' })
    @ApiResponse({ status: 200, type: [WarehouseResponseDto] })
    async getAll(): Promise<WarehouseResponseDto[]> {
        return await this.queryBus.execute(new GetAllWarehousesQuery());
    }
}
