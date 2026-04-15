import { z } from 'zod';

export const configSchema = z.object({
    PORT: z.coerce.number().default(8000),
    GLOBAL_PREFIX: z.coerce.string().default('api'),

    JWT_SECRET: z.coerce.string().min(32),
    JWT_EXPIRES: z.coerce.string().default('15m'),
    
    JWT_REFRESH_SECRET: z.coerce.string().min(32),
    JWT_REFRESH_EXPIRES: z.coerce.string().default('48h'),

    DATABASE_URL: z.coerce.string(),
    MONGO_URI: z.coerce.string(),

    KAFKA_ENABLED: z.coerce.boolean().default(false),
    LOKI_ENABLED: z.coerce.boolean().default(false),
    LOKI_HOST: z.coerce.string(),

    NODE_ENV: z.coerce.string().default('production')
});
