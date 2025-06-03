'use server';

import {TablesInsert} from '@/types/supabase/database.types';
import {supabaseAdmin} from '../supabaseAdmin';

export type ConversationInsert = TablesInsert<'conversations'>;

export async function createConversation(conversation: ConversationInsert) {
  try {
    const {data, error} = await supabaseAdmin
      .from('conversations')
      .insert([conversation]);

    if (error) {
      console.error('Error creating conversation:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error creating conversation:', error);
    throw error;
  }
}
