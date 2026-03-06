import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { publicDataSourceConfig } from './type-orm-config/public-schema.config';

// import { GlobalRegistry } from '@cloud-native-erp/shared/registry';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async () => {
                return {
                    ...publicDataSourceConfig,
                    // entities: GlobalRegistry.entities,
                    // migrations: GlobalRegistry.migrations
                }
            }
        })
    ]
})
export class DatabaseModule {}
