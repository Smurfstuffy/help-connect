import {ApiResponse} from '@/types/app/api';
import axios from 'axios';
import {UserUpdate} from '../../supabase/user/edit';
import {UserProfile} from '../../supabase/user/get';

export const editUser = async (
  userId: string,
  user: UserUpdate,
): Promise<UserProfile | undefined> => {
  const {data} = await axios.put<ApiResponse<UserProfile>>(
    `/api/user-profiles/edit/${userId}`,
    user,
  );
  return data?.data;
};
