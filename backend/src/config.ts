import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 4000,
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtExpiresIn: '15m',
    refreshExpiresIn: '7d',
    corsOrigin: process.env.CORS_ORIGIN,
    databaseUrl: process.env.DATABASE_URL,
    aiProvider: process.env.AI_PROVIDER,
    aiApiKey: process.env.AI_API_KEY,
    aiModel: process.env.AI_MODEL
};