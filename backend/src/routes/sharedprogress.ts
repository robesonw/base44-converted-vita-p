import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.get('/api/sharedprogress', verifyToken, async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    // Implement filtering, sorting, limiting, and offset here
    const progress = await prisma.sharedProgress.findMany({
        // add appropriate query options based on filter, sort, limit, offset
    });
    res.json(progress);
});

router.post('/api/sharedprogress', verifyToken, async (req, res) => {
    const { userId, progressData } = req.body;
    const newProgress = await prisma.sharedProgress.create({
        data: { userId, progressData }
    });
    res.json(newProgress);
});

router.get('/api/sharedprogress/:id', verifyToken, async (req, res) => {
    const progress = await prisma.sharedProgress.findUnique({
        where: { id: Number(req.params.id) }
    });
    if (!progress) return res.status(404).send('Progress not found');
    res.json(progress);
});

router.put('/api/sharedprogress/:id', verifyToken, async (req, res) => {
    const { progressData } = req.body;
    const updatedProgress = await prisma.sharedProgress.update({
        where: { id: Number(req.params.id) },
        data: { progressData }
    });
    res.json(updatedProgress);
});

router.delete('/api/sharedprogress/:id', verifyToken, async (req, res) => {
    await prisma.sharedProgress.delete({
        where: { id: Number(req.params.id) }
    });
    res.status(204).send();
});

export default router;