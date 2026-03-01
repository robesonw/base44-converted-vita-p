import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimiter } from './middleware/rateLimiter';
import errorHandler from './middleware/errorHandler';
import authRouter from './routes/auth';
import aiRouter from './routes/ai';
import uploadRouter from './routes/upload';
import prisma from './lib/prisma';

const app = express();
const config = require('./config').config;

app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(rateLimiter);

// Register all entity routers here
// import FavoriteMealRouter from './routes/favoriteMeal';
// app.use('/api/favorite-meal', FavoriteMealRouter);
// ... (other routers)

app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/api/upload', uploadRouter);

app.use(errorHandler);

const server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    server.close();
});