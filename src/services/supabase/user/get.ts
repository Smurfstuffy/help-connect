'use server';

import {Tables} from '@/types/supabase/database.types';
import {supabaseAdmin} from '../supabaseAdmin';

export type UserProfile = Tables<'user_profiles'>;

export async function getUserById(id: string): Promise<UserProfile | null> {
  try {
    const {data, error} = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching user:', error);
    throw error;
  }
}
