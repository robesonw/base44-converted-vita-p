import { Router } from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.use(verifyToken);

// List
router.get('/api/review', async (req, res) => {
  const { filter, sort, limit, offset } = req.query;
  const reviews = await prisma.review.findMany({
    take: Number(limit) || undefined,
    skip: Number(offset) || undefined,
    // Add filtering and sorting logic here
  });
  res.json(reviews);
});

// Create
router.post('/api/review', async (req, res) => {
  const { rating, content } = req.body;
  const newReview = await prisma.review.create({ data: { rating, content } });
  res.status(201).json(newReview);
});

// Get one
router.get('/api/review/:id', async (req, res) => {
  const { id } = req.params;
  const review = await prisma.review.findUnique({ where: { id: Number(id) } });
  if (!review) return res.status(404).json({ error: 'Review not found' });
  res.json(review);
});

// Update
router.put('/api/review/:id', async (req, res) => {
  const { id } = req.params;
  const { rating, content } = req.body;
  const updatedReview = await prisma.review.update({
    where: { id: Number(id) },
    data: { rating, content },
  });
  res.json(updatedReview);
});

// Delete
router.delete('/api/review/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.review.delete({ where: { id: Number(id) } });
  res.status(204).send();
});

export default router;
