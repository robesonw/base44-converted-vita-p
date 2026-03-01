import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { signAccessToken, signRefreshToken } from '../lib/jwt';
import { prisma } from '../lib/prisma';
import { verifyAuthToken } from '../middleware/auth';

const router = Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: { email, password: hashedPassword }
    });
    const accessToken = signAccessToken({ userId: user.id });
    const refreshToken = signRefreshToken({ userId: user.id });
    res.json({ accessToken, refreshToken, user: { email: user.email, id: user.id } });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const accessToken = signAccessToken({ userId: user.id });
    const refreshToken = signRefreshToken({ userId: user.id });
    res.json({ accessToken, refreshToken, user: { email: user.email, id: user.id } });
});

router.get('/me', verifyAuthToken, (req, res) => {
    res.json({ email: req.user.email, id: req.user.id });
});

router.post('/refresh', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(403).json({ message: 'No token provided.' });
    verifyToken(refreshToken)
        .then(decoded => {
            const accessToken = signAccessToken({ userId: decoded.userId });
            res.json({ accessToken });
        })
        .catch(() => res.status(401).json({ message: 'Invalid refresh token' }));
});

export default router;