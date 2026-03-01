import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../lib/jwt';

export function verifyAuthToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No token provided.' });
    verifyToken(token)
        .then((decoded) => {
            req.user = decoded;
            next();
        })
        .catch((err) => res.status(401).json({ message: 'Unauthorized.', error: err }));
}

export function requireRole(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
        next();
    };
}