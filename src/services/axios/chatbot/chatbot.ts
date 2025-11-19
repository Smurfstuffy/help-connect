import axios from 'axios';
import {ApiResponse} from '@/types/chat';
import {ChatbotMessage} from '@/services/openai/chatbot/chatbot';

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

export const getChatbotResponse = async (
  params: ChatbotRequest,
): Promise<string> => {
  const {data} = await axios.post<ApiResponse<ChatbotResponse>>(
    '/api/chatbot',
    params,
  );

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to get chatbot response');
  }

  return data.data.response;
};
