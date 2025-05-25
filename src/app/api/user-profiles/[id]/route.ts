import {getUserById} from '@/services/supabase/user/get';
import {NextRequest, NextResponse} from 'next/server';
import {ApiResponse, UserProfile} from '@/types/app/api';

export async function GET(
  req: NextRequest,
  context: {params: Promise<{id: string}>},
): Promise<NextResponse<ApiResponse<UserProfile>>> {
  try {
    const {id: userId} = await context.params;
    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json(
        {success: false, error: 'User not found'},
        {status: 404},
      );
    }

    return NextResponse.json({success: true, data: user});
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
