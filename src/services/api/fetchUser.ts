import axios from 'axios';
import {UserProfile} from '../supabase/user/get';
import {ApiResponse} from '@/types/app/api';

export const fetchUser = async (
  userId: string,
): Promise<UserProfile | undefined> => {
  const {data} = await axios.get<ApiResponse<UserProfile>>(
    `/api/user-profile/${userId}`,
  );
  return data?.data;
};
