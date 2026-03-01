import express from 'express';
import { verifyToken } from '../middleware/auth';
import { invokeLLM } from '../lib/ai';

const router = express.Router();

router.post('/invoke', verifyToken, async (req, res) => {
    const { prompt } = req.body;
    const response = await invokeLLM({ prompt });
    res.json({ response });
});

export default router;