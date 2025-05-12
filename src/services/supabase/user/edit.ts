'use server';

import {Tables} from '@/types/supabase/database.types';
import {supabaseAdmin} from '../supabaseAdmin';

export type UserUpdate = Partial<Tables<'user_profiles'>>;

export async function updateUser(id: string, user: UserUpdate) {
  try {
    const {data, error} = await supabaseAdmin
      .from('user_profiles')
      .update(user)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error updating user:', error);
    throw error;
  }
}
