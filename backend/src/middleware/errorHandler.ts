import { NextFunction, Request, Response } from 'express';

export default function errorHandler(err: Error & { status?: number }, req: Request, res: Response, next: NextFunction) {
    res.status(err.status || 500).json({ error: err.message });
}