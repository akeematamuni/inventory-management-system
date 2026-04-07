import { Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CommandBus } from '@nestjs/cqrs';

import { ManualBody, CurrentUser } from "@inventory/core/decorators";

import { SetOpeningStockCommand, SetOpeningStockDto } from "../../application";

@ApiTags('opening-stock')
@Controller('opening-stock')
export class OpeningStockController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Set opening stock for a product in a warehouse',
        description: 'Used once on system go-live to seed initial balances.'
    })
    @ApiResponse({ status: 204, description: 'Opening stock set successfully' })
    @ApiResponse({ status: 422, description: 'Product has balance, use adjustment instead' })
    async set(
        @CurrentUser() user: string,
        @ManualBody(SetOpeningStockDto) dto: SetOpeningStockDto
    ): Promise<void> {
        await this.commandBus.execute(new SetOpeningStockCommand(
            dto.productId,
            dto.warehouseId,
            dto.quantity,
            user,
            dto.unitCost,
            dto.currency,
        ));
    }
}
