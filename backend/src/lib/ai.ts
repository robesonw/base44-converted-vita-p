import { Configuration, OpenAIApi } from 'openai';
import { config } from '../config';

const configuration = new Configuration({
    apiKey: config.aiApiKey,
});
const openai = new OpenAIApi(configuration);

export async function invokeLLM({ prompt, systemPrompt, jsonSchema }) {
    const response = await openai.createChatCompletion({
        model: config.aiModel,
        messages: [{ role: "user", content: prompt }],
    });
    return response.data.choices[0].message.content;
}