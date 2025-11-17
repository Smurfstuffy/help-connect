import {NextRequest, NextResponse} from 'next/server';
import {supabaseAdmin} from '@/services/supabase/supabaseAdmin';
import {ApiResponse} from '@/types/chat';
import {generateConversationSummary} from '@/services/openai/conversations/generateConversationSummary';
import {MessageWithUser} from '@/types/chat';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {conversationId} = body;

    if (!conversationId) {
      return NextResponse.json(
        {success: false, error: 'conversationId is required'},
        {status: 400},
      );
    }

    // Fetch conversation with user and volunteer profiles
    const {data: conversation, error: conversationError} = await supabaseAdmin
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

    if (conversationError || !conversation) {
      return NextResponse.json(
        {success: false, error: 'Conversation not found'},
        {status: 404},
      );
    }

    // Fetch all messages for the conversation
    const {data: messages, error: messagesError} = await supabaseAdmin
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
      .order('created_at', {ascending: true});

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return NextResponse.json(
        {success: false, error: 'Failed to fetch messages'},
        {status: 500},
      );
    }

    // Transform messages to ChatMessage format
    const chatMessages = (messages || []).map((msg: MessageWithUser) => ({
      id: msg.id,
      text: msg.message_text || '',
      senderId: msg.sender_id || '',
      senderName:
        `${msg.user_profiles?.name || ''} ${msg.user_profiles?.surname || ''}`.trim(),
      timestamp: msg.created_at,
      conversationId: msg.conversation_id || '',
    }));

    // Get user and volunteer names
    const userName = conversation.user_profiles
      ? `${conversation.user_profiles.name || ''} ${conversation.user_profiles.surname || ''}`.trim()
      : 'User';
    const volunteerName = conversation.volunteer_profiles
      ? `${conversation.volunteer_profiles.name || ''} ${conversation.volunteer_profiles.surname || ''}`.trim()
      : 'Volunteer';

    // Generate summary
    const summary = await generateConversationSummary({
      conversationTitle: conversation.name,
      messages: chatMessages,
      userId: conversation.user_id || '',
      volunteerId: conversation.volunteer_id || '',
      userName,
      volunteerName,
    });

    return NextResponse.json({
      success: true,
      data: {summary},
    } as ApiResponse<{summary: string}>);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error generating conversation summary:', error);
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
