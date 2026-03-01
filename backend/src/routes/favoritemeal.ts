// FavoriteMeal routes
import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// List FavoriteMeals
router.get('/api/favoritemeal', verifyToken, async (req, res) => {
  const { filter, sort, limit, offset } = req.query;
  const meals = await prisma.favoriteMeal.findMany({
    where: { /* filter logic based on query */ },
    orderBy: { /* sort logic based on query */ },
    take: Number(limit) || undefined,
    skip: Number(offset) || undefined
  });
  res.json(meals);
});

// Create FavoriteMeal
router.post('/api/favoritemeal', verifyToken, async (req, res) => {
  const meal = await prisma.favoriteMeal.create({
    data: req.body
  });
  res.status(201).json(meal);
});

// Get FavoriteMeal by ID
router.get('/api/favoritemeal/:id', verifyToken, async (req, res) => {
  const meal = await prisma.favoriteMeal.findUnique({
    where: { id: Number(req.params.id) }
  });
  if (!meal) return res.status(404).send('Meal not found');
  res.json(meal);
});

// Update FavoriteMeal by ID
router.put('/api/favoritemeal/:id', verifyToken, async (req, res) => {
  const meal = await prisma.favoriteMeal.update({
    where: { id: Number(req.params.id) },
    data: req.body
  });
  res.json(meal);
});

// Delete FavoriteMeal by ID
router.delete('/api/favoritemeal/:id', verifyToken, async (req, res) => {
  await prisma.favoriteMeal.delete({
    where: { id: Number(req.params.id) }
  });
  res.status(204).send();
});

export default router;
