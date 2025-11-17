import axios from 'axios';
import {TranslationLanguage} from '@/services/openai/messages/translateMessage';
import {ApiResponse} from '@/types/chat';

export interface TranslateMessageParams {
  text: string;
  targetLanguage: TranslationLanguage;
}

export interface TranslateMessageResponse {
  translatedText: string;
}

export const translateMessage = async (
  params: TranslateMessageParams,
): Promise<string> => {
  const {data} = await axios.post<ApiResponse<TranslateMessageResponse>>(
    '/api/messages/translate',
    params,
  );

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to translate message');
  }

  return data.data.translatedText;
};
