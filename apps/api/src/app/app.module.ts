import { Module } from '@nestjs/common';

import { CoreModule } from '@inventory/core';
import { DatabaseModule } from '@inventory/database';
import { SharedModule } from '@inventory/shared';
import { UserModule } from '@inventory/user';
import { AuthModule } from '@inventory/auth';
import { InventoryModule } from '@inventory/inventory';

@Module({
    imports: [
        CoreModule,
        DatabaseModule,
        SharedModule,
        UserModule,
        AuthModule,
        InventoryModule
    ]
})
export class AppModule {}
