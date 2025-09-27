import {NextRequest, NextResponse} from 'next/server';
import {supabaseAdmin} from '@/services/supabase/supabaseAdmin';
import {ApiResponse, CreateConversationResponse} from '@/types/chat';

export async function GET(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url);
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('userRole');

    if (!userId || !userRole) {
      return NextResponse.json(
        {success: false, error: 'userId and userRole are required'},
        {status: 400},
      );
    }

    let query = supabaseAdmin.from('conversations').select(`
      *,
      user_profiles!conversations_user_id_fkey (
        name,
        surname
      ),
      volunteer_profiles:user_profiles!conversations_volunteer_id_fkey (
        name,
        surname
      )
    `);

    // Filter based on user role
    if (userRole === 'volunteer') {
      query = query.eq('volunteer_id', userId);
    } else if (userRole === 'user') {
      query = query.eq('user_id', userId);
    } else {
      return NextResponse.json(
        {success: false, error: 'Invalid user role'},
        {status: 400},
      );
    }

    const {data, error} = await query.order('created_at', {ascending: false});

    if (error) {
      console.error('Error fetching conversations:', error);
      return NextResponse.json(
        {success: false, error: 'Failed to fetch conversations'},
        {status: 500},
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    } as ApiResponse<CreateConversationResponse[]>);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
