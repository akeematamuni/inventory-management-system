import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { config } from 'dotenv';

config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('Bootstrap');
    
    const globalPrefix = process.env.GLOBAL_PREFIX || 'api/v1';
    const port = process.env.PORT || 3000;

    app.setGlobalPrefix(globalPrefix);
    await app.listen(port);

    logger.log(`Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
