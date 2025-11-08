import {deleteHelpRequestById} from '@/services/supabase/help-request/delete';
import {NextRequest, NextResponse} from 'next/server';
import {supabaseAdmin} from '@/services/supabase/supabaseAdmin';

export async function DELETE(
  req: NextRequest,
  context: {params: Promise<{id: string}>},
) {
  try {
    const {id} = await context.params;
    const {searchParams} = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {success: false, error: 'User ID is required'},
        {status: 400},
      );
    }

    const {data: helpRequest, error: fetchError} = await supabaseAdmin
      .from('help_requests')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !helpRequest) {
      return NextResponse.json(
        {success: false, error: 'Help request not found'},
        {status: 404},
      );
    }

    if (helpRequest.user_id !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: You can only delete your own help requests',
        },
        {status: 403},
      );
    }

    await deleteHelpRequestById(id);
    return NextResponse.json({success: true, data: {success: true}});
  } catch (error) {
    console.error('Error in delete route:', error);
    return NextResponse.json(
      {success: false, error: (error as Error).message},
      {status: 500},
    );
  }
}
