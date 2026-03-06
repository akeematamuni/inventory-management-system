import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { parsed } from '@inventory/core';

export const publicDataSourceConfig: PostgresConnectionOptions = {
    type: 'postgres',
    url: parsed.data?.DATABASE_URL,
    synchronize: false
};
