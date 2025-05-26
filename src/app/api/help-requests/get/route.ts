import {NextResponse} from 'next/server';
import {ApiResponse, HelpRequest} from '@/types/app/api';
import {getHelpRequest} from '@/services/supabase/help-request/fetch';

export async function GET(): Promise<NextResponse<ApiResponse<HelpRequest[]>>> {
  try {
    const data = await getHelpRequest();
    return NextResponse.json({success: true, data: data ?? []});
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
