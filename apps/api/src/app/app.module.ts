import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CoreModule } from '@inventory/core';
import { DatabaseModule } from '@inventory/database';

@Module({
    imports: [
        CoreModule,
        DatabaseModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
