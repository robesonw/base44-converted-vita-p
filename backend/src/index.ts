import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import authRouter from './routes/auth';
import aiRouter from './routes/ai';
import uploadRouter from './routes/upload';
// Import other entity routers here

const app = express();
app.use(cors({ origin: config.corsOrigin }));
app.use(helmet());
app.use(express.json());
app.use(rateLimiter);

// Register routes
app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/api/upload', uploadRouter);
// app.use('/api/favoritemeals', favoriteMealRouter);
// ... other entity routers

app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});