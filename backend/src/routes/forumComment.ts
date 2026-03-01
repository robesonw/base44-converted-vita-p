import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.use(verifyToken);

// List
router.get('/api/forumComment', async (req, res) => {
  const { filter, sort, limit, offset } = req.query;
  // Implement filtering and sorting logic
  const comments = await prisma.forumComment.findMany({
    take: Number(limit) || 10,
    skip: Number(offset) || 0,
    // Additional filters go here
  });
  res.json(comments);
});

// Create
router.post('/api/forumComment', async (req, res) => {
  const { postId, content } = req.body;
  const newComment = await prisma.forumComment.create({
    data: { postId, content },
  });
  res.status(201).json(newComment);
});

// Get one
router.get('/api/forumComment/:id', async (req, res) => {
  const { id } = req.params;
  const comment = await prisma.forumComment.findUnique({
    where: { id: Number(id) },
  });
  if (!comment) return res.status(404).send('Comment not found');
  res.json(comment);
});

// Update
router.put('/api/forumComment/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const updatedComment = await prisma.forumComment.update({
    where: { id: Number(id) },
    data: { content },
  });
  res.json(updatedComment);
});

// Delete
router.delete('/api/forumComment/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.forumComment.delete({
    where: { id: Number(id) },
  });
  res.status(204).send();
});

export default router;
