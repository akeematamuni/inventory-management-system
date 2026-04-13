import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { config } from 'dotenv';
import { populateRegistry } from './manifest';
import { WinstonModule } from 'nest-winston';
import { baseLogger } from '@inventory/core/logging';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

config();

async function bootstrap() {
    populateRegistry();

    const app = await NestFactory.create(
        AppModule, { logger: WinstonModule.createLogger({ instance: baseLogger}) }
    );

    const logger = new Logger('Bootstrap');
    const config = app.get(ConfigService);
    const globalPrefix = config.get('GLOBAL_PREFIX');
    const port = config.get('PORT');

    app.setGlobalPrefix(globalPrefix);

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Inventory Management System')
        .setDescription(
            'IMS API developed with DDD + Polyglot Architecture & Persistence + CQRS.\n\n' +
            'Built for Chizoba Supply Co., a West African PPE distributor.\n\n' +
            'Run the migrations and seed script first to populate demo data.'
        )
        .setVersion('1.0.0')
        .addBearerAuth()
        .addTag('warehouses', 'Warehouse management')
        .addTag('products', 'Product catalogue')
        .addTag('opening-stock', 'Initial stock seeding')
        .addTag('purchasing', 'Purchase orders and goods receipt')
        .addTag('stock-transfers', 'Inter-warehouse stock transfers')
        .addTag('adjustments', 'Manual stock adjustments')
        .addTag('cycle-counts', 'Periodic counting and stocktakes')
        .addTag('reporting', 'Stock levels, history, alerts, valuation')
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(
        `${globalPrefix}/docs`,
        app, 
        document,
        {
            swaggerOptions: {
                persistAuthorization: true,
                operationsSorter: 'alpha',
                tagsSorter: 'alpha'
            },
            customSiteTitle: 'IMS API Docs'
        }
    );

    await app.listen(port);

    logger.log(`Application is running on: http://localhost:${port}/${globalPrefix}`);
    console.log(`Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
