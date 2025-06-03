'use server';

import {Tables} from '@/types/supabase/database.types';
import {supabaseAdmin} from '../supabaseAdmin';

export type HelpRequest = Tables<'help_requests'>;

export async function getHelpRequest(): Promise<HelpRequest[] | null> {
  try {
    const {data, error} = await supabaseAdmin
      .from('help_requests')
      .select('*')
      .order('created_at', {ascending: true});

    if (error) {
      console.error('Error fetching help requests:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching help requests:', error);
    throw error;
  }
}
