import { z } from 'zod';

export const configSchema = z.object({
    PORT: z.coerce.number(),
    GLOBAL_PREFIX: z.coerce.string(),

    JWT_SECRET: z.coerce.string().min(32),
    JWT_EXPIRES: z.coerce.string(),
    
    JWT_REFRESH_SECRET: z.coerce.string().min(32),
    JWT_REFRESH_EXPIRES: z.coerce.string(),

    DATABASE_URL: z.coerce.string(),
    MONGO_URI: z.coerce.string(),

    KAFKA_ENABLED: z.coerce.boolean(),
    LOKI_ENABLED: z.coerce.boolean(),
    SWAGGER: z.coerce.boolean(),
    LOKI_HOST: z.coerce.string(),

    NODE_ENV: z.coerce.string().optional()
});
