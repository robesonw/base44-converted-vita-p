import { Router } from 'express';
import { invokeLLM } from '../lib/ai';
import { verifyAuthToken } from '../middleware/auth';

const router = Router();

router.post('/invoke', verifyAuthToken, async (req, res) => {
    const { prompt, systemPrompt, jsonSchema } = req.body;
    const result = await invokeLLM({ prompt, systemPrompt, jsonSchema });
    res.json({ result });
});

export default router;