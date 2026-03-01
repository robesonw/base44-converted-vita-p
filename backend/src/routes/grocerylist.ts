// GroceryList routes
import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// List GroceryLists
router.get('/api/grocerylist', verifyToken, async (req, res) => {
  const { filter, sort, limit, offset } = req.query;
  const lists = await prisma.groceryList.findMany({
    where: { /* filter logic based on query */ },
    orderBy: { /* sort logic based on query */ },
    take: Number(limit) || undefined,
    skip: Number(offset) || undefined
  });
  res.json(lists);
});

// Create GroceryList
router.post('/api/grocerylist', verifyToken, async (req, res) => {
  const list = await prisma.groceryList.create({
    data: req.body
  });
  res.status(201).json(list);
});

// Get GroceryList by ID
router.get('/api/grocerylist/:id', verifyToken, async (req, res) => {
  const list = await prisma.groceryList.findUnique({
    where: { id: Number(req.params.id) }
  });
  if (!list) return res.status(404).send('List not found');
  res.json(list);
});

// Update GroceryList by ID
router.put('/api/grocerylist/:id', verifyToken, async (req, res) => {
  const list = await prisma.groceryList.update({
    where: { id: Number(req.params.id) },
    data: req.body
  });
  res.json(list);
});

// Delete GroceryList by ID
router.delete('/api/grocerylist/:id', verifyToken, async (req, res) => {
  await prisma.groceryList.delete({
    where: { id: Number(req.params.id) }
  });
  res.status(204).send();
});

export default router;
