'use server';

import {TablesInsert} from '@/types/supabase/database.types';
import {supabaseAdmin} from '../supabaseAdmin';

export type HelpRequestInsert = TablesInsert<'help_requests'>;

export async function createHelpRequest(helpRequest: HelpRequestInsert) {
  try {
    const {data, error} = await supabaseAdmin
      .from('help_requests')
      .insert([helpRequest]);

    if (error) {
      console.error('Error creating help request:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error creating help request:', error);
    throw error;
  }
}
