import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.use(verifyToken);

// List Nutrition Logs
router.get('/api/nutritionlog', async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    // Implement filtering, sorting, pagination logic here
    const nutritionLogs = await prisma.nutritionLog.findMany({});
    res.json(nutritionLogs);
});

// Create Nutrition Log
router.post('/api/nutritionlog', async (req, res) => {
    const { data } = req.body;
    const nutritionLog = await prisma.nutritionLog.create({ data });
    res.status(201).json(nutritionLog);
});

// Get Nutrition Log by ID
router.get('/api/nutritionlog/:id', async (req, res) => {
    const { id } = req.params;
    const nutritionLog = await prisma.nutritionLog.findUnique({ where: { id: Number(id) } });
    res.json(nutritionLog);
});

// Update Nutrition Log
router.put('/api/nutritionlog/:id', async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const nutritionLog = await prisma.nutritionLog.update({ where: { id: Number(id) }, data });
    res.json(nutritionLog);
});

// Delete Nutrition Log
router.delete('/api/nutritionlog/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.nutritionLog.delete({ where: { id: Number(id) } });
    res.status(204).send();
});

export default router;