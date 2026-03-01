import express from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.use(verifyToken);

// List Notifications
router.get('/api/notification', async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    // Implement filtering, sorting, pagination logic here
    const notifications = await prisma.notification.findMany({});
    res.json(notifications);
});

// Create Notification
router.post('/api/notification', async (req, res) => {
    const { data } = req.body;
    const notification = await prisma.notification.create({ data });
    res.status(201).json(notification);
});

// Get Notification by ID
router.get('/api/notification/:id', async (req, res) => {
    const { id } = req.params;
    const notification = await prisma.notification.findUnique({ where: { id: Number(id) } });
    res.json(notification);
});

// Update Notification
router.put('/api/notification/:id', async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const notification = await prisma.notification.update({ where: { id: Number(id) }, data });
    res.json(notification);
});

// Delete Notification
router.delete('/api/notification/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.notification.delete({ where: { id: Number(id) } });
    res.status(204).send();
});

export default router;