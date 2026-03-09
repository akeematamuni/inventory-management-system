import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { publicDataSourceConfig } from './type-orm-config/datasource.config';
import { GlobalRegistry } from '@inventory/shared/registry';

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
        })
    ]
})
export class DatabaseModule {}
