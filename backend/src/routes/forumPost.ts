import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.use(verifyToken);

// List
router.get('/api/forumPost', async (req, res) => {
  const { filter, sort, limit, offset } = req.query;
  // Implement filtering and sorting logic
  const posts = await prisma.forumPost.findMany({
    take: Number(limit) || 10,
    skip: Number(offset) || 0,
    // Additional filters go here
  });
  res.json(posts);
});

// Create
router.post('/api/forumPost', async (req, res) => {
  const { title, content } = req.body;
  const newPost = await prisma.forumPost.create({
    data: { title, content },
  });
  res.status(201).json(newPost);
});

// Get one
router.get('/api/forumPost/:id', async (req, res) => {
  const { id } = req.params;
  const post = await prisma.forumPost.findUnique({
    where: { id: Number(id) },
  });
  if (!post) return res.status(404).send('Post not found');
  res.json(post);
});

// Update
router.put('/api/forumPost/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const updatedPost = await prisma.forumPost.update({
    where: { id: Number(id) },
    data: { title, content },
  });
  res.json(updatedPost);
});

// Delete
router.delete('/api/forumPost/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.forumPost.delete({
    where: { id: Number(id) },
  });
  res.status(204).send();
});

export default router;
