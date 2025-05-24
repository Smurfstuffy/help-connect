'use server';

import {Tables} from '@/types/supabase/database.types';
import {supabaseAdmin} from '../supabaseAdmin';

export type HelpRequest = Tables<'help_requests'>;

export async function getHelpRequest(): Promise<HelpRequest[] | null> {
  try {
    const {data, error} = await supabaseAdmin.from('help_requests').select('*');

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
