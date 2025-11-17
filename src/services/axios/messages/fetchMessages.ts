import axios from 'axios';
import {ApiResponse, MessageWithUser} from '@/types/chat';

export interface FetchMessagesParams {
  conversationId: string;
  offset?: number;
  limit?: number;
}

export const fetchMessages = async (
  params: FetchMessagesParams,
): Promise<MessageWithUser[] | undefined> => {
  const searchParams = new URLSearchParams();
  searchParams.append('conversationId', params.conversationId);

  if (params.offset !== undefined) {
    searchParams.append('offset', params.offset.toString());
  }
  if (params.limit !== undefined) {
    searchParams.append('limit', params.limit.toString());
  }

  const queryString = searchParams.toString();
  const url = `/api/messages${queryString ? `?${queryString}` : ''}`;

  const {data} = await axios.get<ApiResponse<MessageWithUser[]>>(url);
  return data?.data;
};
