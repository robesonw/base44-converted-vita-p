// UserInteraction CRUD Routes
import { Router } from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = Router();

// List
router.get('/api/userinteraction', verifyToken, async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    const interactions = await prisma.userInteraction.findMany({});
    res.json(interactions);
});

// Create
router.post('/api/userinteraction', verifyToken, async (req, res) => {
    const { userId, recipeId, action } = req.body;
    const newInteraction = await prisma.userInteraction.create({
        data: { userId, recipeId, action },
    });
    res.status(201).json(newInteraction);
});

// Get One
router.get('/api/userinteraction/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const interaction = await prisma.userInteraction.findUnique({ where: { id: Number(id) } });
    res.json(interaction);
});

// Update
router.put('/api/userinteraction/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { userId, recipeId, action } = req.body;
    const updatedInteraction = await prisma.userInteraction.update({
        where: { id: Number(id) },
        data: { userId, recipeId, action },
    });
    res.json(updatedInteraction);
});

// Delete
router.delete('/api/userinteraction/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    await prisma.userInteraction.delete({ where: { id: Number(id) } });
    res.status(204).send();
});

export default router;
