import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  res.status(status).send({ error: err.message });
};

export default errorHandler;