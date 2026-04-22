import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { publicDataSourceConfig } from './type-orm-config/datasource.config';
import { GlobalRegistry } from '@inventory/shared/registry';
import { parsed } from '@inventory/core';

const entities = [...GlobalRegistry.entities];
console.log('Populated entities for database:', entities);

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async () => {
                return {
                    ...publicDataSourceConfig,
                    entities
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
