import axios from 'axios';
import {ApiResponse} from '@/types/app/api';
import {HelpRequest} from '@/services/supabase/help-request/fetch';

export const fetchHelpRequestsByUserId = async (
  userId: string,
): Promise<HelpRequest[] | undefined> => {
  const {data} = await axios.get<ApiResponse<HelpRequest[]>>(
    `/api/help-requests/by-user/${userId}`,
  );
  return data?.data;
};
