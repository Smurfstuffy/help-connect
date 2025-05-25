import {ApiResponse} from '@/types/app/api';
import axios from 'axios';
import {HelpRequestInsert} from '@/services/supabase/help-request/create';

export const createUser = async (
  helpRequest: HelpRequestInsert,
): Promise<HelpRequestInsert | undefined> => {
  const {data} = await axios.post<ApiResponse<HelpRequestInsert>>(
    '/api/help-requests/create',
    helpRequest,
  );
  return data?.data;
};
