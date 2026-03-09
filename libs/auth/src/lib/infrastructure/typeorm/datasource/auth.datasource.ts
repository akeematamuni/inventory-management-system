import { DataSource } from 'typeorm';
import { publicDataSourceConfig, getEntities } from '@inventory/database/type-orm-config';

export default new DataSource({
    ...publicDataSourceConfig,
    entities: getEntities(['auth'])
});
