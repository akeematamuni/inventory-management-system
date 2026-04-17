import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '@inventory/core/decorators';

@ApiTags('Health')
@Controller('health')
export class AppHealthController {
    @Public()
    @Get()
    @ApiOperation({ summary: 'System health check' })
    check() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
}
