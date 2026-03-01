// UserFollow CRUD Routes
import { Router } from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = Router();

// List
router.get('/api/userfollow', verifyToken, async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    const follows = await prisma.userFollow.findMany({});
    res.json(follows);
});

// Create
router.post('/api/userfollow', verifyToken, async (req, res) => {
    const { followerId, followingId } = req.body;
    const newFollow = await prisma.userFollow.create({
        data: { followerId, followingId },
    });
    res.status(201).json(newFollow);
});

// Get One
router.get('/api/userfollow/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const follow = await prisma.userFollow.findUnique({ where: { id: Number(id) } });
    res.json(follow);
});

// Update
router.put('/api/userfollow/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { followerId, followingId } = req.body;
    const updatedFollow = await prisma.userFollow.update({
        where: { id: Number(id) },
        data: { followerId, followingId },
    });
    res.json(updatedFollow);
});

// Delete
router.delete('/api/userfollow/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    await prisma.userFollow.delete({ where: { id: Number(id) } });
    res.status(204).send();
});

export default router;
