import {ApiResponse} from '@/types/app/api';
import axios from 'axios';
import {UserInsert} from '../../supabase/user/create';

export const createUser = async (
  user: UserInsert,
): Promise<UserInsert | undefined> => {
  const {data} = await axios.post<ApiResponse<UserInsert>>(
    '/api/user-profiles/create',
    user,
  );
  return data?.data;
};
