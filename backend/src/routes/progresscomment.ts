import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.get('/api/progresscomment', verifyToken, async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    // Implement filtering, sorting, limiting, and offset here
    const comments = await prisma.progressComment.findMany({
        // add appropriate query options based on filter, sort, limit, offset
    });
    res.json(comments);
});

router.post('/api/progresscomment', verifyToken, async (req, res) => {
    const { content, userId } = req.body;
    const newComment = await prisma.progressComment.create({
        data: { content, userId }
    });
    res.json(newComment);
});

router.get('/api/progresscomment/:id', verifyToken, async (req, res) => {
    const comment = await prisma.progressComment.findUnique({
        where: { id: Number(req.params.id) }
    });
    if (!comment) return res.status(404).send('Comment not found');
    res.json(comment);
});

router.put('/api/progresscomment/:id', verifyToken, async (req, res) => {
    const { content } = req.body;
    const updatedComment = await prisma.progressComment.update({
        where: { id: Number(req.params.id) },
        data: { content }
    });
    res.json(updatedComment);
});

router.delete('/api/progresscomment/:id', verifyToken, async (req, res) => {
    await prisma.progressComment.delete({
        where: { id: Number(req.params.id) }
    });
    res.status(204).send();
});

export default router;