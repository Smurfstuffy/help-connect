'use server';

import {supabase} from '@/lib/supabase';
import {TablesInsert} from '@/types/supabase/database.types';

export type UserInsert = TablesInsert<'user_profiles'>;

export async function createUser(user: UserInsert) {
  try {
    console.log('Creating user profile:', user);
    const {data, error} = await supabase.from('user_profiles').insert([user]);

    if (error) {
      console.error('Error creating user profile:', error);
      throw new Error(error.message);
    }

    console.log('User profile created:', data);
    return data;
  } catch (error) {
    console.error('Unexpected error creating user:', error);
    throw error;
  }
}
