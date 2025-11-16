import {openai, OPENAI_TASK_CONFIGS} from '@/lib/openai';
import {ChatMessage} from '@/types/chat';

export interface GenerateConversationSummaryParams {
  conversationTitle?: string | null;
  messages: ChatMessage[];
  userId: string;
  volunteerId: string;
  userName: string;
  volunteerName: string;
}

/**
 * Generates a concise summary of a conversation between a user and volunteer.
 *
 * @param params - Conversation data including title, messages, and participant info
 * @returns A generated conversation summary
 */
export async function generateConversationSummary(
  params: GenerateConversationSummaryParams,
): Promise<string> {
  const {
    conversationTitle,
    messages,
    userId,
    volunteerId,
    userName,
    volunteerName,
  } = params;

  // Format messages for the prompt
  const formattedMessages = messages.map(msg => {
    const senderType = msg.senderId === userId ? 'user' : 'volunteer';
    const senderName = msg.senderId === userId ? userName : volunteerName;
    return {
      sender: senderType,
      senderName,
      text: msg.text,
      timestamp: msg.timestamp,
    };
  });

  const contextParts: string[] = [];
  if (conversationTitle) {
    contextParts.push(`Conversation Title: ${conversationTitle}`);
  }
  contextParts.push(`\nParticipants:`);
  contextParts.push(`- User: ${userName} (ID: ${userId})`);
  contextParts.push(`- Volunteer: ${volunteerName} (ID: ${volunteerId})`);

  contextParts.push(`\nConversation Messages:`);
  formattedMessages.forEach((msg, index) => {
    contextParts.push(
      `[${index + 1}] ${msg.sender === 'user' ? 'User' : 'Volunteer'} (${msg.senderName}): ${msg.text}`,
    );
  });

  const prompt = `You are a helpful assistant that generates concise summaries of help request conversations.

Generate a clear, structured summary of this conversation that includes:
- Key topics discussed
- Important decisions or agreements made
- Action items or next steps (if any)
- Overall status of the help request coordination

The summary should be:
- Professional and clear
- Concise but informative (2-4 paragraphs)
- Focus on the most important information
- Written in third person

${contextParts.join('\n')}

Generate only the summary, nothing else:`;

  try {
    const config = {
      model: OPENAI_TASK_CONFIGS.TITLE_GENERATION.model,
      temperature: 0.5,
      maxTokens: 500,
    };

    const response = await openai.chat.completions.create({
      model: config.model,
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that generates clear, concise summaries of help request conversations. Focus on key information, decisions, and action items.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    });

    const summary = response.choices[0]?.message?.content?.trim();

    if (!summary) {
      throw new Error('Failed to generate conversation summary');
    }

    return summary;
  } catch (error) {
    console.error('Error generating conversation summary:', error);
    throw error;
  }
}
