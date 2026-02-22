import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import prisma from '../lib/prisma';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

export const requireRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) return res.sendStatus(403);
        next();
    };
};

export const attachUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    prisma.user.findUnique({ where: { id: userId }}).then((user: User | null) => {
        req.user = user;
        next();
    });
};