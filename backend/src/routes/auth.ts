import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { verifyToken, requireRole } from '../middleware/auth';
import { signAccessToken, signRefreshToken } from '../lib/jwt';
import { prisma } from '../lib/prisma'; // assuming Prisma Client is set up

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash: hashedPassword, name }
  });
  const accessToken = signAccessToken({ id: user.id, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id });
  return res.json({ accessToken, refreshToken, user: { ...user, passwordHash: undefined } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });
  const accessToken = signAccessToken({ id: user.id, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id });
  return res.json({ accessToken, refreshToken, user: { ...user, passwordHash: undefined } });
});

router.get('/me', verifyToken, (req, res) => {
  return res.json(req.user);
});

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided.' });
  try {
    const payload = verifyToken(refreshToken);
    const newAccessToken = signAccessToken({ id: payload.id, role: payload.role });
    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid refresh token.' });
  }
});

router.post('/logout', (req, res) => {
  // client-side will remove the token
  return res.json({ message: 'Logged out successfully.' });
});

export default router;
