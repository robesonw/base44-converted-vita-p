import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.use(verifyToken);

// List Meal Plans
router.get('/api/mealplan', async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    // Implement filtering, sorting, pagination logic here
    const mealPlans = await prisma.mealPlan.findMany({});
    res.json(mealPlans);
});

// Create Meal Plan
router.post('/api/mealplan', async (req, res) => {
    const { data } = req.body;
    const mealPlan = await prisma.mealPlan.create({ data });
    res.status(201).json(mealPlan);
});

// Get Meal Plan by ID
router.get('/api/mealplan/:id', async (req, res) => {
    const { id } = req.params;
    const mealPlan = await prisma.mealPlan.findUnique({ where: { id: Number(id) } });
    res.json(mealPlan);
});

// Update Meal Plan
router.put('/api/mealplan/:id', async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const mealPlan = await prisma.mealPlan.update({ where: { id: Number(id) }, data });
    res.json(mealPlan);
});

// Delete Meal Plan
router.delete('/api/mealplan/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.mealPlan.delete({ where: { id: Number(id) } });
    res.status(204).send();
});

export default router;