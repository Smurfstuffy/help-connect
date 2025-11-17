import {NextRequest, NextResponse} from 'next/server';
import {supabaseAdmin} from '@/services/supabase/supabaseAdmin';
import {ApiResponse, ConversationWithUsers} from '@/types/chat';

export async function GET(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        {success: false, error: 'conversationId is required'},
        {status: 400},
      );
    }

    // Fetch conversation with user and volunteer profiles
    const {data, error} = await supabaseAdmin
      .from('conversations')
      .select(
        `
        *,
        user_profiles!conversations_user_id_fkey (
          name,
          surname
        ),
        volunteer_profiles:user_profiles!conversations_volunteer_id_fkey (
          name,
          surname
        )
      `,
      )
      .eq('id', conversationId)
      .single();

    if (error || !data) {
      console.error('Error fetching conversation:', error);
      return NextResponse.json(
        {success: false, error: 'Conversation not found'},
        {status: 404},
      );
    }

    return NextResponse.json({
      success: true,
      data: data as ConversationWithUsers,
    } as ApiResponse<ConversationWithUsers>);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
