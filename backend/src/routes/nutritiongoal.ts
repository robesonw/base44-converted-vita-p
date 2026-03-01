import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.use(verifyToken);

// GET /api/nutritiongoal
router.get('/nutritiongoal', async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    const nutritionGoals = await prisma.nutritionGoal.findMany();
    res.json(nutritionGoals);
});

// POST /api/nutritiongoal
router.post('/nutritiongoal', async (req, res) => {
    const { data } = req.body;
    const nutritionGoal = await prisma.nutritionGoal.create({ data });
    res.status(201).json(nutritionGoal);
});

// GET /api/nutritiongoal/:id
router.get('/nutritiongoal/:id', async (req, res) => {
    const { id } = req.params;
    const nutritionGoal = await prisma.nutritionGoal.findUnique({ where: { id: parseInt(id) } });
    if (!nutritionGoal) return res.status(404).send('NutritionGoal not found');
    res.json(nutritionGoal);
});

// PUT /api/nutritiongoal/:id
router.put('/nutritiongoal/:id', async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const nutritionGoal = await prisma.nutritionGoal.update({
        where: { id: parseInt(id) },
        data,
    });
    res.json(nutritionGoal);
});

// DELETE /api/nutritiongoal/:id
router.delete('/nutritiongoal/:id', async (req, res) => {
    const { id } = req.params;
    const nutritionGoal = await prisma.nutritionGoal.delete({ where: { id: parseInt(id) } });
    res.json(nutritionGoal);
});

export default router;