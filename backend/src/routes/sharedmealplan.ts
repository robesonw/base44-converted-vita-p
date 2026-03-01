import { Router } from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.use(verifyToken);

// List
router.get('/api/sharedmealplan', async (req, res) => {
  const { filter, sort, limit, offset } = req.query;
  const mealPlans = await prisma.sharedMealPlan.findMany({
    take: Number(limit) || undefined,
    skip: Number(offset) || undefined,
    // Add filtering and sorting logic here
  });
  res.json(mealPlans);
});

// Create
router.post('/api/sharedmealplan', async (req, res) => {
  const { title, description } = req.body;
  const newMealPlan = await prisma.sharedMealPlan.create({ data: { title, description } });
  res.status(201).json(newMealPlan);
});

// Get one
router.get('/api/sharedmealplan/:id', async (req, res) => {
  const { id } = req.params;
  const mealPlan = await prisma.sharedMealPlan.findUnique({ where: { id: Number(id) } });
  if (!mealPlan) return res.status(404).json({ error: 'Meal Plan not found' });
  res.json(mealPlan);
});

// Update
router.put('/api/sharedmealplan/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const updatedMealPlan = await prisma.sharedMealPlan.update({
    where: { id: Number(id) },
    data: { title, description },
  });
  res.json(updatedMealPlan);
});

// Delete
router.delete('/api/sharedmealplan/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.sharedMealPlan.delete({ where: { id: Number(id) } });
  res.status(204).send();
});

export default router;
