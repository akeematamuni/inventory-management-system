import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

/**
 * Explicitly transform and validate the incoming Kafka message payload
 * Usage: @KafkaPayload(StockReceivedEvent)
*/
/* eslint-disable @typescript-eslint/no-explicit-any */
export const KafkaPayload = <T extends object>(dto: new (...args: any[]) => T) => {
    /* eslint-enable @typescript-eslint/no-explicit-any */
    return createParamDecorator(async (_data: unknown, ctx: ExecutionContext): Promise<T> => {
        const message = ctx.switchToRpc().getData();

        // Kafka messages arrive as Buffer or string
        const raw = typeof message === 'string'
            ? JSON.parse(message) : Buffer.isBuffer(message)
                ? JSON.parse(message.toString()) : message;

        const instance = plainToInstance(
            dto, raw, { enableImplicitConversion: true, excludeExtraneousValues: false }
        );

        const errors = await validate(
            instance as object, 
            { whitelist: true, forbidNonWhitelisted: false, skipMissingProperties: false }
        );

        if (errors.length > 0) {
            const messages = errors.map(e => Object.values(e.constraints ?? {}).join(', '));
            throw new BadRequestException(`Kafka payload validation failed: ${messages.join(' | ')}`);
        }

        return instance;
    })();
};
