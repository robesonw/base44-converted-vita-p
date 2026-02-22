import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'change-me-refresh',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.REFRESH_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL,
  aiProvider: process.env.AI_PROVIDER || 'openai',
  aiApiKey: process.env.AI_API_KEY,
  aiModel: process.env.AI_MODEL || 'gpt-4o-mini'
};
