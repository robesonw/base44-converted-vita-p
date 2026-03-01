import { Router } from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.use(verifyToken);

// List
router.get('/api/sharedprogress', async (req, res) => {
  const { filter, sort, limit, offset } = req.query;
  const progress = await prisma.sharedProgress.findMany({
    take: Number(limit) || undefined,
    skip: Number(offset) || undefined,
    // Add filtering and sorting logic here
  });
  res.json(progress);
});

// Create
router.post('/api/sharedprogress', async (req, res) => {
  const { description, details } = req.body;
  const newProgress = await prisma.sharedProgress.create({ data: { description, details } });
  res.status(201).json(newProgress);
});

// Get one
router.get('/api/sharedprogress/:id', async (req, res) => {
  const { id } = req.params;
  const progress = await prisma.sharedProgress.findUnique({ where: { id: Number(id) } });
  if (!progress) return res.status(404).json({ error: 'Progress not found' });
  res.json(progress);
});

// Update
router.put('/api/sharedprogress/:id', async (req, res) => {
  const { id } = req.params;
  const { description, details } = req.body;
  const updatedProgress = await prisma.sharedProgress.update({
    where: { id: Number(id) },
    data: { description, details },
  });
  res.json(updatedProgress);
});

// Delete
router.delete('/api/sharedprogress/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.sharedProgress.delete({ where: { id: Number(id) } });
  res.status(204).send();
});

export default router;
