import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.use(verifyToken);

// GET /api/nutritionlog
router.get('/nutritionlog', async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    const nutritionLogs = await prisma.nutritionLog.findMany();
    res.json(nutritionLogs);
});

// POST /api/nutritionlog
router.post('/nutritionlog', async (req, res) => {
    const { data } = req.body;
    const nutritionLog = await prisma.nutritionLog.create({ data });
    res.status(201).json(nutritionLog);
});

// GET /api/nutritionlog/:id
router.get('/nutritionlog/:id', async (req, res) => {
    const { id } = req.params;
    const nutritionLog = await prisma.nutritionLog.findUnique({ where: { id: parseInt(id) } });
    if (!nutritionLog) return res.status(404).send('NutritionLog not found');
    res.json(nutritionLog);
});

// PUT /api/nutritionlog/:id
router.put('/nutritionlog/:id', async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const nutritionLog = await prisma.nutritionLog.update({
        where: { id: parseInt(id) },
        data,
    });
    res.json(nutritionLog);
});

// DELETE /api/nutritionlog/:id
router.delete('/nutritionlog/:id', async (req, res) => {
    const { id } = req.params;
    const nutritionLog = await prisma.nutritionLog.delete({ where: { id: parseInt(id) } });
    res.json(nutritionLog);
});

export default router;