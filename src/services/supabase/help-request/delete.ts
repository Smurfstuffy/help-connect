'use server';

import {supabaseAdmin} from '../supabaseAdmin';

export async function deleteHelpRequestById(id: string) {
  try {
    const {error} = await supabaseAdmin
      .from('help_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting help request:', error);
      throw new Error(error.message);
    }

    return {success: true};
  } catch (error) {
    console.error('Unexpected error deleting help request:', error);
    throw error;
  }
}
