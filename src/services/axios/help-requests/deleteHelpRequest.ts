import axios from 'axios';
import {ApiResponse} from '@/types/app/api';

export const deleteHelpRequest = async (
  id: string,
  userId: string,
): Promise<{success: boolean} | undefined> => {
  const {data} = await axios.delete<ApiResponse<{success: boolean}>>(
    `/api/help-requests/delete/${id}?userId=${userId}`,
  );
  return data?.data;
};
