import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.use(verifyToken);

// List Lab Results
router.get('/api/labresult', async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    // Implement filtering, sorting, pagination logic here
    const labResults = await prisma.labResult.findMany({});
    res.json(labResults);
});

// Create Lab Result
router.post('/api/labresult', async (req, res) => {
    const { data } = req.body;
    const labResult = await prisma.labResult.create({ data });
    res.status(201).json(labResult);
});

// Get Lab Result by ID
router.get('/api/labresult/:id', async (req, res) => {
    const { id } = req.params;
    const labResult = await prisma.labResult.findUnique({ where: { id: Number(id) } });
    res.json(labResult);
});

// Update Lab Result
router.put('/api/labresult/:id', async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const labResult = await prisma.labResult.update({ where: { id: Number(id) }, data });
    res.json(labResult);
});

// Delete Lab Result
router.delete('/api/labresult/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.labResult.delete({ where: { id: Number(id) } });
    res.status(204).send();
});

export default router;