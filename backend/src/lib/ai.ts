import { config } from '../config';
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: config.aiApiKey });

export async function invokeLLM({ prompt, systemPrompt, jsonSchema }) {
  const messages = [{ role: 'user', content: prompt }];
  if (systemPrompt) messages.unshift({ role: 'system', content: systemPrompt });
  const res = await client.chat.completions.create({
    model: config.aiModel,
    messages,
    response_format: jsonSchema ? { type: 'json_object' } : { type: 'text' }
  });
  const text = res.choices[0].message.content || '';
  return jsonSchema ? JSON.parse(text) : text;
};
