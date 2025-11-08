import {openai, OPENAI_TASK_CONFIGS} from '@/lib/openai';

export interface GenerateChatTitleParams {
  city?: string | null;
  category?: string | null;
  description?: string | null;
}

/**
 * Generates a concise, descriptive title for a chat conversation
 * based on the help request data (city, category, description).
 *
 * @param params - Help request data (city, category, description)
 * @returns A generated chat title (max 50 characters)
 */
export async function generateChatTitle(
  params: GenerateChatTitleParams,
): Promise<string> {
  const {city, category, description} = params;

  const contextParts: string[] = [];
  if (city) {
    contextParts.push(`Location: ${city}`);
  }
  if (category) {
    contextParts.push(`Category: ${category}`);
  }
  if (description) {
    contextParts.push(`Request: ${description}`);
  }

  if (contextParts.length === 0) {
    return 'Help Request Chat';
  }

  const prompt = `Generate a concise, descriptive title for a help request chat conversation. 
The title should be:
- Maximum 50 characters
- Descriptive of the main topic or purpose
- Professional and clear
- No quotes or special formatting

Help request information:
${contextParts.join('\n')}

Generate only the title, nothing else:`;

  try {
    const config = OPENAI_TASK_CONFIGS.TITLE_GENERATION;

    const response = await openai.chat.completions.create({
      model: config.model,
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that generates concise, descriptive titles for help request chat conversations based on location, category, and description. Be consistent and clear.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    });

    const title = response.choices[0]?.message?.content?.trim();

    if (!title) {
      throw new Error('Failed to generate chat title');
    }

    return title.length > 50 ? title.substring(0, 47) + '...' : title;
  } catch (error) {
    console.error('Error generating chat title:', error);
    // Fallback to default title if OpenAI call fails
    return 'Help Request Chat';
  }
}
