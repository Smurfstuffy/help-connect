import axios from 'axios';
import {ApiResponse} from '@/types/app/api';
import {
  ParsedHelpRequest,
  ParseHelpRequestError,
} from '@/services/openai/help-requests/parseHelpRequest';

export const parseHelpRequest = async (
  text: string,
): Promise<ParsedHelpRequest | ParseHelpRequestError> => {
  const {data} = await axios.post<
    ApiResponse<ParsedHelpRequest | ParseHelpRequestError>
  >('/api/help-requests/parse', {text});

  if (!data?.data) {
    throw new Error('Failed to parse help request');
  }

  return data.data;
};
