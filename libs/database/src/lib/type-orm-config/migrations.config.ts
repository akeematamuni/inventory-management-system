import { DataSource } from 'typeorm';
import { publicDataSourceConfig } from './datasource.config';
import { getMigrations } from './util.config';

/** COMMAND: pnpm exec tsx libs/database/src/lib/type-orm-config/migrations.config.ts */

async function runPublicMigrations() {
    const migrations =  await getMigrations();

    console.log('Starting migration script for public...\n', migrations);

    const publicDataSource = new DataSource({
        ...publicDataSourceConfig,
        migrations
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
