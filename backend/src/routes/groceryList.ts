import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.use(verifyToken);

// List
router.get('/api/groceryList', async (req, res) => {
  const { filter, sort, limit, offset } = req.query;
  // Implement filtering and sorting logic
  const lists = await prisma.groceryList.findMany({
    take: Number(limit) || 10,
    skip: Number(offset) || 0,
    // Additional filters go here
  });
  res.json(lists);
});

// Create
router.post('/api/groceryList', async (req, res) => {
  const { title, items } = req.body;
  const newList = await prisma.groceryList.create({
    data: { title, items },
  });
  res.status(201).json(newList);
});

// Get one
router.get('/api/groceryList/:id', async (req, res) => {
  const { id } = req.params;
  const list = await prisma.groceryList.findUnique({
    where: { id: Number(id) },
  });
  if (!list) return res.status(404).send('List not found');
  res.json(list);
});

// Update
router.put('/api/groceryList/:id', async (req, res) => {
  const { id } = req.params;
  const { title, items } = req.body;
  const updatedList = await prisma.groceryList.update({
    where: { id: Number(id) },
    data: { title, items },
  });
  res.json(updatedList);
});

// Delete
router.delete('/api/groceryList/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.groceryList.delete({
    where: { id: Number(id) },
  });
  res.status(204).send();
});

export default router;
