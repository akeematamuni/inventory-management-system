import { Module } from '@nestjs/common';

import { CoreModule } from '@inventory/core';
import { DatabaseModule } from '@inventory/database';
import { SharedModule } from '@inventory/shared';
import { UserModule } from '@inventory/user';
import { AuthModule } from '@inventory/auth';
import { InventoryModule } from '@inventory/inventory';
import { MetricsModule } from '@inventory/metrics';

import { AppHealthController } from './app.controller';

@Module({
    imports: [
        CoreModule,
        DatabaseModule,
        SharedModule,
        UserModule,
        AuthModule,
        InventoryModule,
        MetricsModule
    ],
    controllers: [AppHealthController]
})
export class AppModule {}
