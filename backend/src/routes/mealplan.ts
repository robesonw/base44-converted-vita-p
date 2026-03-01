import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.use(verifyToken);

// GET /api/mealplan
router.get('/mealplan', async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    const mealPlans = await prisma.mealPlan.findMany();
    res.json(mealPlans);
});

// POST /api/mealplan
router.post('/mealplan', async (req, res) => {
    const { data } = req.body;
    const mealPlan = await prisma.mealPlan.create({ data });
    res.status(201).json(mealPlan);
});

// GET /api/mealplan/:id
router.get('/mealplan/:id', async (req, res) => {
    const { id } = req.params;
    const mealPlan = await prisma.mealPlan.findUnique({ where: { id: parseInt(id) } });
    if (!mealPlan) return res.status(404).send('MealPlan not found');
    res.json(mealPlan);
});

// PUT /api/mealplan/:id
router.put('/mealplan/:id', async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const mealPlan = await prisma.mealPlan.update({
        where: { id: parseInt(id) },
        data,
    });
    res.json(mealPlan);
});

// DELETE /api/mealplan/:id
router.delete('/mealplan/:id', async (req, res) => {
    const { id } = req.params;
    const mealPlan = await prisma.mealPlan.delete({ where: { id: parseInt(id) } });
    res.json(mealPlan);
});

export default router;