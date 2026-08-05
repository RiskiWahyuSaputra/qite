import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY || '';
export const groqModel = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

let groqInstance: Groq | null = null;

export function getGroqClient(): Groq {
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in environment variables');
  }
  if (!groqInstance) {
    groqInstance = new Groq({ apiKey });
  }
  return groqInstance;
}

/**
 * Execute structured JSON chat completion with Groq with retry and timeout protection
 */
export async function callGroqStructured<T>(
  systemPrompt: string,
  userPrompt: string,
  fallbackOnError?: T
): Promise<T> {
  const client = getGroqClient();

  try {
    const completion = await client.chat.completions.create({
      model: groqModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 3500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response received from Groq AI');
    }

    const parsed = JSON.parse(content) as T;
    return parsed;
  } catch (error: unknown) {
    console.error('Groq API Error:', error);
    if (fallbackOnError !== undefined) {
      return fallbackOnError;
    }
    throw error;
  }
}
