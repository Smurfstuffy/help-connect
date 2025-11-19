import {openai, OPENAI_TASK_CONFIGS} from '@/lib/openai';

export interface ChatbotMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatbotParams {
  messages: ChatbotMessage[];
  userContext: {
    name?: string;
    surname?: string;
    role?: string;
    language?: string;
  };
}

/**
 * Generates a chatbot response using OpenAI.
 * The chatbot is context-aware and understands the Help Connect app context.
 *
 * @param params - Chat messages and user context
 * @returns Assistant response text
 */
export async function getChatbotResponse(
  params: ChatbotParams,
): Promise<string> {
  const {messages, userContext} = params;

  // Build user context string
  const contextParts: string[] = [];
  if (userContext.name || userContext.surname) {
    const fullName = [userContext.name, userContext.surname]
      .filter(Boolean)
      .join(' ');
    contextParts.push(`User name: ${fullName}`);
  }
  if (userContext.role) {
    contextParts.push(`User role: ${userContext.role}`);
  }
  if (userContext.language) {
    contextParts.push(`User language preference: ${userContext.language}`);
  }

  const userContextString =
    contextParts.length > 0
      ? `\n\nUser Information:\n${contextParts.join('\n')}`
      : '';

  const systemPrompt = `You are a helpful AI assistant for the Help Connect platform, a community-driven application that connects people in need with volunteers who can help.

Your role is to:
- Help users understand how to use the platform
- Guide users on creating help requests
- Assist volunteers in finding ways to help
- Answer questions about the platform's features
- Provide general support and guidance

Context about Help Connect:
- Users can create help requests with categories: Food, Transportation, Medical, Shelter, Clothing, or Other
- Help requests have urgency levels: Low, Medium, High, Critical
- Users can communicate with volunteers through chat conversations
- The platform supports both English and Ukrainian languages

Be friendly, concise, and helpful. If you don't know something specific about the platform, acknowledge it and provide general helpful guidance.${userContextString}

Respond naturally and conversationally. Keep responses concise but informative.`;

  try {
    const config = {
      model: OPENAI_TASK_CONFIGS.TITLE_GENERATION.model,
      temperature: 0.7, // More creative for conversational responses
      maxTokens: 500,
    };

    const response = await openai.chat.completions.create({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    });

    const assistantMessage = response.choices[0]?.message?.content?.trim();

    if (!assistantMessage) {
      throw new Error('Failed to get chatbot response');
    }

    return assistantMessage;
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    throw error;
  }
}
