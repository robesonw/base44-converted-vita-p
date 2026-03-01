// ForumPost routes
import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// List ForumPosts
router.get('/api/forumpost', verifyToken, async (req, res) => {
  const { filter, sort, limit, offset } = req.query;
  const posts = await prisma.forumPost.findMany({
    where: { /* filter logic based on query */ },
    orderBy: { /* sort logic based on query */ },
    take: Number(limit) || undefined,
    skip: Number(offset) || undefined
  });
  res.json(posts);
});

// Create ForumPost
router.post('/api/forumpost', verifyToken, async (req, res) => {
  const post = await prisma.forumPost.create({
    data: req.body
  });
  res.status(201).json(post);
});

// Get ForumPost by ID
router.get('/api/forumpost/:id', verifyToken, async (req, res) => {
  const post = await prisma.forumPost.findUnique({
    where: { id: Number(req.params.id) }
  });
  if (!post) return res.status(404).send('Post not found');
  res.json(post);
});

// Update ForumPost by ID
router.put('/api/forumpost/:id', verifyToken, async (req, res) => {
  const post = await prisma.forumPost.update({
    where: { id: Number(req.params.id) },
    data: req.body
  });
  res.json(post);
});

// Delete ForumPost by ID
router.delete('/api/forumpost/:id', verifyToken, async (req, res) => {
  await prisma.forumPost.delete({
    where: { id: Number(req.params.id) }
  });
  res.status(204).send();
});

export default router;
