import { Router } from 'express';
import prisma from '../lib/prisma';
import { verifyJwt } from '../lib/jwt';

const router = Router();

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const decoded = verifyJwt(refreshToken);
    // Logic to handle refresh token
  } catch (error) {
    res.status(401).send({ message: 'Invalid token' });
  }
});

export default router;