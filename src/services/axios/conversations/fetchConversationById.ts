import axios from 'axios';
import {ApiResponse, Conversation} from '@/types/app/api';

export const fetchConversationById = async (
  userId: string,
): Promise<Conversation[] | undefined> => {
  const {data} = await axios.get<ApiResponse<Conversation[]>>(
    `/api/conversations/${userId}`,
  );
  return data?.data;
};
