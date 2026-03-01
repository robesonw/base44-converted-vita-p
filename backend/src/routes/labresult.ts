import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.use(verifyToken);

// GET /api/labresult
router.get('/labresult', async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    // Implement logic to filter, sort, limit and offset
    const labResults = await prisma.labResult.findMany();
    res.json(labResults);
});

// POST /api/labresult
router.post('/labresult', async (req, res) => {
    const { data } = req.body;
    const labResult = await prisma.labResult.create({ data });
    res.status(201).json(labResult);
});

// GET /api/labresult/:id
router.get('/labresult/:id', async (req, res) => {
    const { id } = req.params;
    const labResult = await prisma.labResult.findUnique({ where: { id: parseInt(id) } });
    if (!labResult) return res.status(404).send('LabResult not found');
    res.json(labResult);
});

// PUT /api/labresult/:id
router.put('/labresult/:id', async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const labResult = await prisma.labResult.update({
        where: { id: parseInt(id) },
        data,
    });
    res.json(labResult);
});

// DELETE /api/labresult/:id
router.delete('/labresult/:id', async (req, res) => {
    const { id } = req.params;
    const labResult = await prisma.labResult.delete({ where: { id: parseInt(id) } });
    res.json(labResult);
});

export default router;