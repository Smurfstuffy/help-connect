import axios from 'axios';
import {ApiResponse, ConversationWithUsers} from '@/types/chat';

export const fetchConversationByIdService = async (
  conversationId: string,
): Promise<ConversationWithUsers | undefined> => {
  const {data} = await axios.get<ApiResponse<ConversationWithUsers>>(
    `/api/conversations/get-by-id?conversationId=${conversationId}`,
  );
  return data?.data;
};
