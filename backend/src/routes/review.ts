import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.get('/api/review', verifyToken, async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    // Implement filtering, sorting, limiting, and offset here
    const reviews = await prisma.review.findMany({
        // add appropriate query options based on filter, sort, limit, offset
    });
    res.json(reviews);
});

router.post('/api/review', verifyToken, async (req, res) => {
    const { rating, content, recipeId, userId } = req.body;
    const newReview = await prisma.review.create({
        data: { rating, content, recipeId, userId }
    });
    res.json(newReview);
});

router.get('/api/review/:id', verifyToken, async (req, res) => {
    const review = await prisma.review.findUnique({
        where: { id: Number(req.params.id) }
    });
    if (!review) return res.status(404).send('Review not found');
    res.json(review);
});

router.put('/api/review/:id', verifyToken, async (req, res) => {
    const { rating, content } = req.body;
    const updatedReview = await prisma.review.update({
        where: { id: Number(req.params.id) },
        data: { rating, content }
    });
    res.json(updatedReview);
});

router.delete('/api/review/:id', verifyToken, async (req, res) => {
    await prisma.review.delete({
        where: { id: Number(req.params.id) }
    });
    res.status(204).send();
});

export default router;