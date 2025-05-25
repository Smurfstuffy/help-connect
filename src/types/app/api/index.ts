import {Tables} from '@/types/supabase/database.types';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type UserProfile = Tables<'user_profiles'>;
export type HelpRequest = Tables<'help_requests'>;
