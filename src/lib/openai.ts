import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

export const openai = new OpenAI({
  apiKey: apiKey,
});

export const OPENAI_MODEL = 'gpt-4o-mini';

export const OPENAI_CONFIG = {
  model: OPENAI_MODEL,
  temperature: 0.7,
  maxTokens: 1000,
} as const;

export const OPENAI_TASK_CONFIGS = {
  TITLE_GENERATION: {
    model: OPENAI_MODEL,
    temperature: 0.3,
    maxTokens: 50,
  },
} as const;

export const OPENAI_FUNCTIONS = {} as const;
