'use server';

import {TablesInsert} from '@/types/supabase/database.types';
import {supabaseAdmin} from '../supabaseAdmin';

export type UserInsert = TablesInsert<'user_profiles'>;

export async function createUser(user: UserInsert) {
  try {
    const {data, error} = await supabaseAdmin
      .from('user_profiles')
      .insert([user]);

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
