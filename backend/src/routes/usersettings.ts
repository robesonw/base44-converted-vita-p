// UserSettings CRUD Routes
import { Router } from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = Router();

// List
router.get('/api/usersettings', verifyToken, async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    const settings = await prisma.userSettings.findMany({});
    res.json(settings);
});

// Create
router.post('/api/usersettings', verifyToken, async (req, res) => {
    const { userId, settings } = req.body;
    const newSettings = await prisma.userSettings.create({
        data: { userId, settings },
    });
    res.status(201).json(newSettings);
});

// Get One
router.get('/api/usersettings/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const setting = await prisma.userSettings.findUnique({ where: { id: Number(id) } });
    res.json(setting);
});

// Update
router.put('/api/usersettings/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { userId, settings } = req.body;
    const updatedSettings = await prisma.userSettings.update({
        where: { id: Number(id) },
        data: { userId, settings },
    });
    res.json(updatedSettings);
});

// Delete
router.delete('/api/usersettings/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    await prisma.userSettings.delete({ where: { id: Number(id) } });
    res.status(204).send();
});

export default router;
