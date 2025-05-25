'use server';

import {supabaseAdmin} from '../supabaseAdmin';
import {HelpRequest} from './fetch';

export async function fetchHelpRequestsByUserId(
  userId: string,
): Promise<HelpRequest[] | null> {
  try {
    const {data, error} = await supabaseAdmin
      .from('help_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', {ascending: true});

    if (error) {
      console.error('Error fetching help requests by user id:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching help requests by user id:', error);
    throw error;
  }
}
