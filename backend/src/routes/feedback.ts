// Feedback routes
import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// List Feedback
router.get('/api/feedback', verifyToken, async (req, res) => {
  const { filter, sort, limit, offset } = req.query;
  const feedbacks = await prisma.feedback.findMany({
    where: { /* filter logic based on query */ },
    orderBy: { /* sort logic based on query */ },
    take: Number(limit) || undefined,
    skip: Number(offset) || undefined
  });
  res.json(feedbacks);
});

// Create Feedback
router.post('/api/feedback', verifyToken, async (req, res) => {
  const feedback = await prisma.feedback.create({
    data: req.body
  });
  res.status(201).json(feedback);
});

// Get Feedback by ID
router.get('/api/feedback/:id', verifyToken, async (req, res) => {
  const feedback = await prisma.feedback.findUnique({
    where: { id: Number(req.params.id) }
  });
  if (!feedback) return res.status(404).send('Feedback not found');
  res.json(feedback);
});

// Update Feedback by ID
router.put('/api/feedback/:id', verifyToken, async (req, res) => {
  const feedback = await prisma.feedback.update({
    where: { id: Number(req.params.id) },
    data: req.body
  });
  res.json(feedback);
});

// Delete Feedback by ID
router.delete('/api/feedback/:id', verifyToken, async (req, res) => {
  await prisma.feedback.delete({
    where: { id: Number(req.params.id) }
  });
  res.status(204).send();
});

export default router;
