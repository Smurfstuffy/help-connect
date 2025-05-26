import {NextRequest, NextResponse} from 'next/server';
import {fetchHelpRequestsByUserId} from '@/services/supabase/help-request/fetchHelpRequestsById';

export async function GET(
  req: NextRequest,
  context: {params: Promise<{userId: string}>},
) {
  try {
    const {userId} = await context.params;
    const data = await fetchHelpRequestsByUserId(userId);
    return NextResponse.json({success: true, data});
  } catch (error) {
    return NextResponse.json(
      {success: false, error: (error as Error).message},
      {status: 500},
    );
  }
}
