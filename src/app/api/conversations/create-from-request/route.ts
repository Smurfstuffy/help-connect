import {NextRequest, NextResponse} from 'next/server';
import {supabaseAdmin} from '@/services/supabase/supabaseAdmin';
import {
  ApiResponse,
  CreateConversationRequest,
  CreateConversationResponse,
} from '@/types/chat';
import {generateChatTitle} from '@/services/openai/conversations/generateChatTitle';

export async function POST(request: NextRequest) {
  try {
    const body: CreateConversationRequest = await request.json();
    const {helpRequestId, volunteerId} = body;

    if (!helpRequestId || !volunteerId) {
      return NextResponse.json(
        {success: false, error: 'Missing required fields'},
        {status: 400},
      );
    }

    // Get the help request to find the original user and data for title generation
    const {data: helpRequest, error: helpRequestError} = await supabaseAdmin
      .from('help_requests')
      .select('user_id, city, category, description')
      .eq('id', helpRequestId)
      .single();

    if (helpRequestError || !helpRequest) {
      return NextResponse.json(
        {success: false, error: 'Help request not found'},
        {status: 404},
      );
    }

    const requestUserId = helpRequest.user_id;

    // Generate chat title based on help request data
    let chatTitle = 'Help Request Chat';
    try {
      chatTitle = await generateChatTitle({
        city: helpRequest.city,
        category: helpRequest.category,
        description: helpRequest.description,
      });
    } catch (error) {
      console.error('Error generating chat title, using default:', error);
      // Continue with default title if generation fails
    }

    // Check if conversation already exists for this specific help request
    const {data: existingConversation} = await supabaseAdmin
      .from('conversations')
      .select('id')
      .eq('help_request_id', helpRequestId)
      .single();

    if (existingConversation) {
      return NextResponse.json({
        success: true,
        data: existingConversation,
        message: 'Conversation already exists',
      });
    }

    // Create new conversation for this specific help request
    const {data: conversation, error: conversationError} = await supabaseAdmin
      .from('conversations')
      .insert({
        user_id: requestUserId,
        volunteer_id: volunteerId,
        help_request_id: helpRequestId,
        name: chatTitle,
      })
      .select()
      .single();

    if (conversationError) {
      console.error('Error creating conversation:', conversationError);
      return NextResponse.json(
        {success: false, error: 'Failed to create conversation'},
        {status: 500},
      );
    }

    return NextResponse.json({
      success: true,
      data: conversation,
    } as ApiResponse<CreateConversationResponse>);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
