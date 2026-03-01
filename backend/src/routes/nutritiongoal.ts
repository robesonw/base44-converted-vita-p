import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.use(verifyToken);

// List Nutrition Goals
router.get('/api/nutritiongoal', async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    // Implement filtering, sorting, pagination logic here
    const nutritionGoals = await prisma.nutritionGoal.findMany({});
    res.json(nutritionGoals);
});

// Create Nutrition Goal
router.post('/api/nutritiongoal', async (req, res) => {
    const { data } = req.body;
    const nutritionGoal = await prisma.nutritionGoal.create({ data });
    res.status(201).json(nutritionGoal);
});

// Get Nutrition Goal by ID
router.get('/api/nutritiongoal/:id', async (req, res) => {
    const { id } = req.params;
    const nutritionGoal = await prisma.nutritionGoal.findUnique({ where: { id: Number(id) } });
    res.json(nutritionGoal);
});

// Update Nutrition Goal
router.put('/api/nutritiongoal/:id', async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const nutritionGoal = await prisma.nutritionGoal.update({ where: { id: Number(id) }, data });
    res.json(nutritionGoal);
});

// Delete Nutrition Goal
router.delete('/api/nutritiongoal/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.nutritionGoal.delete({ where: { id: Number(id) } });
    res.status(204).send();
});

export default router;