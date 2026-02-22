import { Router } from 'express';
import { invokeLLM } from '../lib/ai';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.post('/invoke', verifyToken, async (req, res) => {
    const { prompt, systemPrompt, jsonSchema } = req.body;
    try {
        const response = await invokeLLM({ prompt, systemPrompt, jsonSchema });
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error invoking LLM' });
    }
});

export default router;