// UserPreferences CRUD Routes
import { Router } from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = Router();

// List
router.get('/api/userpreferences', verifyToken, async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    const preferences = await prisma.userPreferences.findMany({});
    res.json(preferences);
});

// Create
router.post('/api/userpreferences', verifyToken, async (req, res) => {
    const { userId, preferences } = req.body;
    const newPreferences = await prisma.userPreferences.create({
        data: { userId, preferences },
    });
    res.status(201).json(newPreferences);
});

// Get One
router.get('/api/userpreferences/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const preference = await prisma.userPreferences.findUnique({ where: { id: Number(id) } });
    res.json(preference);
});

// Update
router.put('/api/userpreferences/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { userId, preferences } = req.body;
    const updatedPreferences = await prisma.userPreferences.update({
        where: { id: Number(id) },
        data: { userId, preferences },
    });
    res.json(updatedPreferences);
});

// Delete
router.delete('/api/userpreferences/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    await prisma.userPreferences.delete({ where: { id: Number(id) } });
    res.status(204).send();
});

export default router;
