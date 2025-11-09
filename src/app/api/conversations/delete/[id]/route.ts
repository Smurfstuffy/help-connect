import {deleteConversationById} from '@/services/supabase/conversations/delete';
import {NextRequest, NextResponse} from 'next/server';
import {supabaseAdmin} from '@/services/supabase/supabaseAdmin';

export async function DELETE(
  req: NextRequest,
  context: {params: Promise<{id: string}>},
) {
  try {
    const {id} = await context.params;
    const {searchParams} = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {success: false, error: 'User ID is required'},
        {status: 400},
      );
    }

    const {data: conversation, error: fetchError} = await supabaseAdmin
      .from('conversations')
      .select('user_id, volunteer_id')
      .eq('id', id)
      .single();

    if (fetchError || !conversation) {
      return NextResponse.json(
        {success: false, error: 'Conversation not found'},
        {status: 404},
      );
    }

    const isOwner =
      conversation.user_id === userId || conversation.volunteer_id === userId;

    if (!isOwner) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: You can only delete your own conversations',
        },
        {status: 403},
      );
    }

    await deleteConversationById(id);
    return NextResponse.json({success: true, data: {success: true}});
  } catch (error) {
    console.error('Error in delete route:', error);
    return NextResponse.json(
      {success: false, error: (error as Error).message},
      {status: 500},
    );
  }
}
