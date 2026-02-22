import openai from 'openai'; // adjust to real SDK import
import { AI_PROVIDER, AI_API_KEY } from '../config';

export const invokeLLM = async ({ prompt, systemPrompt, jsonSchema }) => {
    const client = getClient(AI_PROVIDER);

    const response = await client.call({
        prompt,
        systemPrompt,
        jsonSchema
    });

    return response.data;
};

const getClient = (provider) => {
    // Return a client based on the provider
    switch (provider) {
        case 'openai':
            return new OpenAIClient(AI_API_KEY);
        // add cases for other providers
        default:
            throw new Error('Unsupported AI provider');
    }
};