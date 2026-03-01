import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.use(verifyToken);

// List
router.get('/api/favoriteMeal', async (req, res) => {
  const { filter, sort, limit, offset } = req.query;
  // Implement filtering and sorting logic
  const meals = await prisma.favoriteMeal.findMany({
    take: Number(limit) || 10,
    skip: Number(offset) || 0,
    // Additional filters go here
  });
  res.json(meals);
});

// Create
router.post('/api/favoriteMeal', async (req, res) => {
  const { name, description } = req.body;
  const newMeal = await prisma.favoriteMeal.create({
    data: { name, description },
  });
  res.status(201).json(newMeal);
});

// Get one
router.get('/api/favoriteMeal/:id', async (req, res) => {
  const { id } = req.params;
  const meal = await prisma.favoriteMeal.findUnique({
    where: { id: Number(id) },
  });
  if (!meal) return res.status(404).send('Meal not found');
  res.json(meal);
});

// Update
router.put('/api/favoriteMeal/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const updatedMeal = await prisma.favoriteMeal.update({
    where: { id: Number(id) },
    data: { name, description },
  });
  res.json(updatedMeal);
});

// Delete
router.delete('/api/favoriteMeal/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.favoriteMeal.delete({
    where: { id: Number(id) },
  });
  res.status(204).send();
});

export default router;
