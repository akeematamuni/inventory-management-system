import { DataSource } from 'typeorm';
import { publicDataSourceConfig } from './public-schema.config';
import { getEntitiesOrMigrations } from './util.config';

/**
Utility script for running batch migrations for public schema.
Uses the same generic configs used by individual modules. 
COMMAND: pnpm exec tsx libs/database/src/lib/type-orm-config/public-migrations.config.ts
*/

export const publicModules: string[] = [
    'billing',
    'tenant',
    'auth',
    'public-user'
]

async function runPublicMigrations() {
    console.log('Starting migration script for public...');

    const publicDataSource = new DataSource({
        ...publicDataSourceConfig,
        migrations: getEntitiesOrMigrations(publicModules, 'migrations'),
    });

    try {
        await publicDataSource.initialize();
        await publicDataSource.runMigrations();
        await publicDataSource.destroy();
        
        console.log('Migration script for public finished successfully...');

    } catch (error) {
        console.error(`Error occurred during the migration\n${error}`);
        process.exit(1);

    } finally {
        if (publicDataSource && publicDataSource.isInitialized) {
            await publicDataSource.destroy();
        }
    }
}

if (require.main === module && !process.argv[1].includes('main.js')) {
    runPublicMigrations();
}
