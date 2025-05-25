import {changeClosedStatusById} from '@/services/supabase/help-request/changeClosedStatusById';
import {NextRequest, NextResponse} from 'next/server';

export async function PUT(
  req: NextRequest,
  context: {params: Promise<{id: string}>},
) {
  try {
    const {id} = await context.params;
    const data = await changeClosedStatusById(id);
    return NextResponse.json({success: true, data});
  } catch (error) {
    console.error('Error in toggle-closed route:', error);
    return NextResponse.json(
      {success: false, error: (error as Error).message},
      {status: 500},
    );
  }
}
