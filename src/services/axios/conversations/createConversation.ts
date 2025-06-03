import {ApiResponse} from '@/types/app/api';
import axios from 'axios';
import {ConversationInsert} from '@/services/supabase/conversations/create';

export const createConversation = async (
  conversation: ConversationInsert,
): Promise<ConversationInsert | undefined> => {
  const {data} = await axios.post<ApiResponse<ConversationInsert>>(
    '/api/conversations/create',
    conversation,
  );
  return data?.data;
};
