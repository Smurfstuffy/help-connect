import {NextRequest, NextResponse} from 'next/server';
import {ApiResponse} from '@/types/chat';
import {
  getChatbotResponse,
  ChatbotMessage,
} from '@/services/openai/chatbot/chatbot';

export interface ChatbotRequest {
  messages: ChatbotMessage[];
  userContext: {
    name?: string;
    surname?: string;
    role?: string;
    language?: string;
  };
}

export interface ChatbotResponse {
  response: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatbotRequest = await request.json();
    const {messages, userContext} = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'messages array is required and cannot be empty',
        },
        {status: 400},
      );
    }

    // Validate messages structure
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return NextResponse.json(
          {success: false, error: 'Each message must have role and content'},
          {status: 400},
        );
      }
      if (msg.role !== 'user' && msg.role !== 'assistant') {
        return NextResponse.json(
          {success: false, error: 'Message role must be "user" or "assistant"'},
          {status: 400},
        );
      }
    }

    // Get chatbot response
    const response = await getChatbotResponse({
      messages,
      userContext: userContext || {},
    });

    return NextResponse.json({
      success: true,
      data: {response},
    } as ApiResponse<ChatbotResponse>);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error getting chatbot response:', error);
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
