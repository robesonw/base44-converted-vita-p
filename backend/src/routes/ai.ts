import express from 'express';
import { verifyToken } from '../middleware/auth';
import { invokeLLM } from '../lib/ai';

const router = express.Router();

router.post('/invoke', verifyToken, async (req, res) => {
  const { prompt, systemPrompt, jsonSchema } = req.body;
  try {
    const response = await invokeLLM({ prompt, systemPrompt, jsonSchema });
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: 'AI invocation failed.', error });
  }
});

export default router;
