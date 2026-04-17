import { Controller, Get, Res } from '@nestjs/common';
import { PrometheusController } from '@willsoto/nestjs-prometheus';
import { Public } from '@inventory/core/decorators';
import { Response } from 'express';

@Controller('metrics')
export class MetricsController extends PrometheusController {
    @Public() 
    @Get()
    override async index(@Res({ passthrough: true }) res: Response) {
        return await super.index(res);
    }
}
