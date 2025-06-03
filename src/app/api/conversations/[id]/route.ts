import {NextRequest, NextResponse} from 'next/server';
import {ApiResponse, Conversation} from '@/types/app/api';
import {getConversations} from '@/services/supabase/conversations/fetch';

export async function GET(
  req: NextRequest,
  context: {params: Promise<{userId: string}>},
): Promise<NextResponse<ApiResponse<Conversation[]>>> {
  try {
    const {userId} = await context.params;
    const conversations = await getConversations(userId);

    if (!conversations) {
      return NextResponse.json(
        {success: false, error: 'Conversations not found'},
        {status: 404},
      );
    }

    return NextResponse.json({success: true, data: conversations});
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
