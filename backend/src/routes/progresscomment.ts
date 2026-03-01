import { Router } from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.use(verifyToken);

// List
router.get('/api/progresscomment', async (req, res) => {
  const { filter, sort, limit, offset } = req.query;
  const comments = await prisma.progressComment.findMany({
    take: Number(limit) || undefined,
    skip: Number(offset) || undefined,
    // Add filtering and sorting logic here
  });
  res.json(comments);
});

// Create
router.post('/api/progresscomment', async (req, res) => {
  const { content } = req.body;
  const newComment = await prisma.progressComment.create({ data: { content } });
  res.status(201).json(newComment);
});

// Get one
router.get('/api/progresscomment/:id', async (req, res) => {
  const { id } = req.params;
  const comment = await prisma.progressComment.findUnique({ where: { id: Number(id) } });
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  res.json(comment);
});

// Update
router.put('/api/progresscomment/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const updatedComment = await prisma.progressComment.update({
    where: { id: Number(id) },
    data: { content },
  });
  res.json(updatedComment);
});

// Delete
router.delete('/api/progresscomment/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.progressComment.delete({ where: { id: Number(id) } });
  res.status(204).send();
});

export default router;
