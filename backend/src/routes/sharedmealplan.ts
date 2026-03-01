import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.get('/api/sharedmealplan', verifyToken, async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    // Implement filtering, sorting, limiting, and offset here
    const mealPlans = await prisma.sharedMealPlan.findMany({
        // add appropriate query options based on filter, sort, limit, offset
    });
    res.json(mealPlans);
});

router.post('/api/sharedmealplan', verifyToken, async (req, res) => {
    const { userId, mealPlanData } = req.body;
    const newMealPlan = await prisma.sharedMealPlan.create({
        data: { userId, mealPlanData }
    });
    res.json(newMealPlan);
});

router.get('/api/sharedmealplan/:id', verifyToken, async (req, res) => {
    const mealPlan = await prisma.sharedMealPlan.findUnique({
        where: { id: Number(req.params.id) }
    });
    if (!mealPlan) return res.status(404).send('Meal Plan not found');
    res.json(mealPlan);
});

router.put('/api/sharedmealplan/:id', verifyToken, async (req, res) => {
    const { mealPlanData } = req.body;
    const updatedMealPlan = await prisma.sharedMealPlan.update({
        where: { id: Number(req.params.id) },
        data: { mealPlanData }
    });
    res.json(updatedMealPlan);
});

router.delete('/api/sharedmealplan/:id', verifyToken, async (req, res) => {
    await prisma.sharedMealPlan.delete({
        where: { id: Number(req.params.id) }
    });
    res.status(204).send();
});

export default router;