'use server';

import {supabase} from '@/lib/supabase';
import {TablesInsert} from '@/types/supabase/database.types';

export type UserInsert = TablesInsert<'user_profiles'>;

export async function createUser(user: UserInsert) {
  try {
    const {data, error} = await supabase.from('user_profiles').insert([user]);

    if (error) {
      console.error('Error creating user profile:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error creating user:', error);
    throw error;
  }
}
