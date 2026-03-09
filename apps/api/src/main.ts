import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { config } from 'dotenv';
import { populateRegistry } from './manifest';
import { WinstonModule } from 'nest-winston';
import { baseLogger } from '@inventory/core/logging';
import { ConfigService } from '@nestjs/config';

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
    await app.listen(port);

    logger.log(`Application is running on: http://localhost:${port}/${globalPrefix}`);
    console.log(`Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
