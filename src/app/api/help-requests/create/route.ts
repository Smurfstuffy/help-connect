import {NextRequest, NextResponse} from 'next/server';
import {ApiResponse, HelpRequest} from '@/types/app/api';
import {createHelpRequest} from '@/services/supabase/help-request/create';

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<HelpRequest>>> {
  try {
    const user = await req.json();
    const data = await createHelpRequest(user);
    return NextResponse.json({success: true, data: data?.[0]});
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
