'use server';

import {supabaseAdmin} from '../supabaseAdmin';

export async function deleteConversationById(id: string) {
  try {
    const {error: messagesError} = await supabaseAdmin
      .from('messages')
      .delete()
      .eq('conversation_id', id)
      .select();

    if (messagesError) {
      console.error('Error deleting messages:', messagesError);
      throw new Error(messagesError.message);
    }

    const {error: conversationError} = await supabaseAdmin
      .from('conversations')
      .delete()
      .eq('id', id);

    if (conversationError) {
      console.error('Error deleting conversation:', conversationError);
      throw new Error(conversationError.message);
    }

    return {success: true};
  } catch (error) {
    console.error('Unexpected error deleting conversation:', error);
    throw error;
  }
}
