import { Router } from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.use(verifyToken);

// List
router.get('/api/recipecomment', async (req, res) => {
  const { filter, sort, limit, offset } = req.query;
  const comments = await prisma.recipeComment.findMany({
    take: Number(limit) || undefined,
    skip: Number(offset) || undefined,
    // Add filtering and sorting logic here
  });
  res.json(comments);
});

// Create
router.post('/api/recipecomment', async (req, res) => {
  const { content } = req.body;
  const newComment = await prisma.recipeComment.create({ data: { content } });
  res.status(201).json(newComment);
});

// Get one
router.get('/api/recipecomment/:id', async (req, res) => {
  const { id } = req.params;
  const comment = await prisma.recipeComment.findUnique({ where: { id: Number(id) } });
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  res.json(comment);
});

// Update
router.put('/api/recipecomment/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const updatedComment = await prisma.recipeComment.update({
    where: { id: Number(id) },
    data: { content },
  });
  res.json(updatedComment);
});

// Delete
router.delete('/api/recipecomment/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.recipeComment.delete({ where: { id: Number(id) } });
  res.status(204).send();
});

export default router;
