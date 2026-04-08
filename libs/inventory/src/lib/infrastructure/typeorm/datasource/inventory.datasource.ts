import { DataSource } from 'typeorm';
import { publicDataSourceConfig, getEntities } from '@inventory/database/type-orm-config';

export default new DataSource({
    ...publicDataSourceConfig,
    entities: getEntities(['inventory'])
});

// libs/inventory/src/lib/infrastructure/typeorm/datasource/inventory.datasource.ts
// libs/database/src/lib/migrations/CreateInventoryTables
