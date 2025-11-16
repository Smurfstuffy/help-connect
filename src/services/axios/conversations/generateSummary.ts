import axios from 'axios';
import {ApiResponse} from '@/types/chat';

export interface GenerateSummaryParams {
  conversationId: string;
}

export interface GenerateSummaryResponse {
  summary: string;
}

export const generateConversationSummary = async (
  params: GenerateSummaryParams,
): Promise<string> => {
  const {data} = await axios.post<ApiResponse<GenerateSummaryResponse>>(
    '/api/conversations/summary',
    params,
  );

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to generate summary');
  }

  return data.data.summary;
};
