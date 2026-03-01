import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.use(verifyToken);

// List
router.get('/api/feedback', async (req, res) => {
  const { filter, sort, limit, offset } = req.query;
  // Implement filtering and sorting logic
  const feedbackItems = await prisma.feedback.findMany({
    take: Number(limit) || 10,
    skip: Number(offset) || 0,
    // Additional filters go here
  });
  res.json(feedbackItems);
});

// Create
router.post('/api/feedback', async (req, res) => {
  const { comment, rating } = req.body;
  const newFeedback = await prisma.feedback.create({
    data: { comment, rating },
  });
  res.status(201).json(newFeedback);
});

// Get one
router.get('/api/feedback/:id', async (req, res) => {
  const { id } = req.params;
  const feedbackItem = await prisma.feedback.findUnique({
    where: { id: Number(id) },
  });
  if (!feedbackItem) return res.status(404).send('Feedback not found');
  res.json(feedbackItem);
});

// Update
router.put('/api/feedback/:id', async (req, res) => {
  const { id } = req.params;
  const { comment, rating } = req.body;
  const updatedFeedback = await prisma.feedback.update({
    where: { id: Number(id) },
    data: { comment, rating },
  });
  res.json(updatedFeedback);
});

// Delete
router.delete('/api/feedback/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.feedback.delete({
    where: { id: Number(id) },
  });
  res.status(204).send();
});

export default router;
