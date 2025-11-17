import {NextRequest, NextResponse} from 'next/server';
import {supabaseAdmin} from '@/services/supabase/supabaseAdmin';
import {ApiResponse, CreateMessageRequest, MessageWithUser} from '@/types/chat';

export async function POST(request: NextRequest) {
  try {
    const body: CreateMessageRequest = await request.json();
    const {conversationId, senderId, text} = body;

    if (!conversationId || !senderId || !text) {
      return NextResponse.json(
        {success: false, error: 'Missing required fields'},
        {status: 400},
      );
    }

    // Save message to database
    const {data, error} = await supabaseAdmin
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        message_text: text,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving message:', error);
      return NextResponse.json(
        {success: false, error: 'Failed to save message'},
        {status: 500},
      );
    }

    return NextResponse.json({
      success: true,
      data,
    } as ApiResponse<MessageWithUser>);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}

export async function GET(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const offset = searchParams.get('offset');
    const limit = searchParams.get('limit');

    if (!conversationId) {
      return NextResponse.json(
        {success: false, error: 'conversationId is required'},
        {status: 400},
      );
    }

    // Fetch messages for the conversation with user details
    // Order by created_at DESC (most recent first) for reverse pagination
    let query = supabaseAdmin
      .from('messages')
      .select(
        `
        *,
        user_profiles!messages_sender_id_fkey (
          name,
          surname
        )
      `,
      )
      .eq('conversation_id', conversationId)
      .order('created_at', {ascending: false});

    // Apply pagination if provided
    if (offset !== null && limit !== null) {
      const offsetNum = parseInt(offset, 10);
      const limitNum = parseInt(limit, 10);
      if (!isNaN(offsetNum) && !isNaN(limitNum)) {
        const from = offsetNum;
        const to = offsetNum + limitNum - 1;
        query = query.range(from, to);
      }
    }

    const {data, error} = await query;

    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json(
        {success: false, error: 'Failed to fetch messages'},
        {status: 500},
      );
    }

    return NextResponse.json({success: true, data: data || []} as ApiResponse<
      MessageWithUser[]
    >);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
