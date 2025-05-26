import axios from 'axios';
import {ApiResponse} from '@/types/app/api';
import {HelpRequest} from '@/services/supabase/help-request/fetch';

export const changeClosedStatusById = async (
  id: string,
): Promise<HelpRequest | undefined> => {
  const {data} = await axios.put<ApiResponse<HelpRequest>>(
    `/api/help-requests/toggle-closed/${id}`,
  );
  return data?.data;
};
