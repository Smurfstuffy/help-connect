'use server';

import {supabaseAdmin} from '../supabaseAdmin';

export async function changeClosedStatusById(id: string) {
  try {
    const {data: currentRequest, error: fetchError} = await supabaseAdmin
      .from('help_requests')
      .select('is_closed')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching help request:', fetchError);
      throw new Error(fetchError.message);
    }

    const {data, error} = await supabaseAdmin
      .from('help_requests')
      .update({is_closed: !currentRequest.is_closed})
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating help request:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error updating help request:', error);
    throw error;
  }
}
