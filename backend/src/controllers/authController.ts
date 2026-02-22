import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { signAccessToken, signRefreshToken } from '../lib/jwt';

export const register = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: { email, passwordHash: hashedPassword, name }
    });

    const accessToken = signAccessToken({ id: user.id });
    const refreshToken = signRefreshToken({ id: user.id });

    res.json({ accessToken, refreshToken, user });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email }});

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = signAccessToken({ id: user.id });
    const refreshToken = signRefreshToken({ id: user.id });

    res.json({ accessToken, refreshToken, user });
};

export const me = (req: Request, res: Response) => {
    const user = req.user; // Already attached by middleware
    res.json(user);
};

export const refresh = (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = signAccessToken({ id: user.id });
        res.json({ accessToken });
    });
};

export const logout = (req: Request, res: Response) => {
    // Client should handle token removal;
    res.sendStatus(200);
};