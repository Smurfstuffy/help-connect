'use server';

import {Tables} from '@/types/supabase/database.types';
import {supabaseAdmin} from '../supabaseAdmin';

export type Conversation = Tables<'conversations'>;

export async function getConversations(
  userId: string,
): Promise<Conversation[] | null> {
  try {
    const {data, error} = await supabaseAdmin
      .from('conversations')
      .select('*')
      .or(`user_id.eq.${userId},volunteer_id.eq.${userId}`)
      .order('created_at', {ascending: true});

    if (error) {
      console.error('Error fetching conversations:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching conversations:', error);
    throw error;
  }
}
