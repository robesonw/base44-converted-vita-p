import { apiFetch } from './api';

export async function invokeAI(opts: { prompt: string; systemPrompt?: string; jsonSchema?: object }): Promise<unknown> {
  return apiFetch('POST', '/api/ai/invoke', opts);
}