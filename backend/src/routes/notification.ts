import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.use(verifyToken);

// GET /api/notification
router.get('/notification', async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    const notifications = await prisma.notification.findMany();
    res.json(notifications);
});

// POST /api/notification
router.post('/notification', async (req, res) => {
    const { data } = req.body;
    const notification = await prisma.notification.create({ data });
    res.status(201).json(notification);
});

// GET /api/notification/:id
router.get('/notification/:id', async (req, res) => {
    const { id } = req.params;
    const notification = await prisma.notification.findUnique({ where: { id: parseInt(id) } });
    if (!notification) return res.status(404).send('Notification not found');
    res.json(notification);
});

// PUT /api/notification/:id
router.put('/notification/:id', async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const notification = await prisma.notification.update({
        where: { id: parseInt(id) },
        data,
    });
    res.json(notification);
});

// DELETE /api/notification/:id
router.delete('/notification/:id', async (req, res) => {
    const { id } = req.params;
    const notification = await prisma.notification.delete({ where: { id: parseInt(id) } });
    res.json(notification);
});

export default router;