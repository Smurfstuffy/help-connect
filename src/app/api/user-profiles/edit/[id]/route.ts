import {NextRequest, NextResponse} from 'next/server';
import {updateUser} from '@/services/supabase/user/edit';
import {UserUpdate} from '@/services/supabase/user/edit';

export async function PUT(
  request: NextRequest,
  context: {params: Promise<{id: string}>},
) {
  try {
    const {id} = await context.params;
    const body = await request.json();
    const userData = body as UserUpdate;

    const updatedUser = await updateUser(id, userData);

    return NextResponse.json({data: updatedUser});
  } catch (error) {
    console.error('Error in edit profile route:', error);
    return NextResponse.json(
      {error: 'Failed to update profile'},
      {status: 500},
    );
  }
}
