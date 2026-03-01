// ForumComment routes
import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// List ForumComments
router.get('/api/forumcomment', verifyToken, async (req, res) => {
  const { filter, sort, limit, offset } = req.query;
  const comments = await prisma.forumComment.findMany({
    where: { /* filter logic based on query */ },
    orderBy: { /* sort logic based on query */ },
    take: Number(limit) || undefined,
    skip: Number(offset) || undefined
  });
  res.json(comments);
});

// Create ForumComment
router.post('/api/forumcomment', verifyToken, async (req, res) => {
  const comment = await prisma.forumComment.create({
    data: req.body
  });
  res.status(201).json(comment);
});

// Get ForumComment by ID
router.get('/api/forumcomment/:id', verifyToken, async (req, res) => {
  const comment = await prisma.forumComment.findUnique({
    where: { id: Number(req.params.id) }
  });
  if (!comment) return res.status(404).send('Comment not found');
  res.json(comment);
});

// Update ForumComment by ID
router.put('/api/forumcomment/:id', verifyToken, async (req, res) => {
  const comment = await prisma.forumComment.update({
    where: { id: Number(req.params.id) },
    data: req.body
  });
  res.json(comment);
});

// Delete ForumComment by ID
router.delete('/api/forumcomment/:id', verifyToken, async (req, res) => {
  await prisma.forumComment.delete({
    where: { id: Number(req.params.id) }
  });
  res.status(204).send();
});

export default router;
