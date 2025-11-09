import axios from 'axios';
import {ApiResponse} from '@/types/app/api';

export const deleteConversation = async (
  id: string,
  userId: string,
): Promise<{success: boolean} | undefined> => {
  const {data} = await axios.delete<ApiResponse<{success: boolean}>>(
    `/api/conversations/delete/${id}?userId=${userId}`,
  );
  return data?.data;
};
