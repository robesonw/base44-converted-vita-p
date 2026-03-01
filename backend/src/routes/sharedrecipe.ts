// SharedRecipe CRUD Routes
import { Router } from 'express';
import prisma from '../lib/prisma';
import { verifyToken } from '../middleware/auth';

const router = Router();

// List
router.get('/api/sharedrecipe', verifyToken, async (req, res) => {
    const { filter, sort, limit, offset } = req.query;
    // Implement filtering, sorting, limit, and offset logic here
    const recipes = await prisma.sharedRecipe.findMany({});
    res.json(recipes);
});

// Create
router.post('/api/sharedrecipe', verifyToken, async (req, res) => {
    const { title, ingredients, instructions } = req.body;
    const newRecipe = await prisma.sharedRecipe.create({
        data: { title, ingredients, instructions },
    });
    res.status(201).json(newRecipe);
});

// Get One
router.get('/api/sharedrecipe/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const recipe = await prisma.sharedRecipe.findUnique({ where: { id: Number(id) } });
    res.json(recipe);
});

// Update
router.put('/api/sharedrecipe/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { title, ingredients, instructions } = req.body;
    const updatedRecipe = await prisma.sharedRecipe.update({
        where: { id: Number(id) },
        data: { title, ingredients, instructions },
    });
    res.json(updatedRecipe);
});

// Delete
router.delete('/api/sharedrecipe/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    await prisma.sharedRecipe.delete({ where: { id: Number(id) } });
    res.status(204).send();
});

export default router;
