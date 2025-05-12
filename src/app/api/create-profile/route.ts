import {NextRequest, NextResponse} from 'next/server';
import {createUser} from '@/services/supabase/user/create';
import {ApiResponse, UserProfile} from '@/types/app/api';

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<UserProfile>>> {
  try {
    const user = await req.json();
    const data = await createUser(user);
    return NextResponse.json({success: true, data: data?.[0]});
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
