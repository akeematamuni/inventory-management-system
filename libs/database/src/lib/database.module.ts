import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { publicDataSourceConfig } from './type-orm-config/datasource.config';
import { GlobalRegistry } from '@inventory/shared/registry';
import { parsed } from '@inventory/core';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async () => {
                return {
                    ...publicDataSourceConfig,
                    entities: GlobalRegistry.entities,
                }
            }
        }),
        MongooseModule.forRootAsync({
            useFactory: async () => ({
                uri: parsed.data?.MONGO_URI
            })
        })
    ]
})
export class DatabaseModule {}
