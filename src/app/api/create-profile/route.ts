import {NextRequest, NextResponse} from 'next/server';
import {createUser} from '@/actions/user/create';

export async function POST(req: NextRequest) {
  try {
    const user = await req.json();
    const data = await createUser(user);
    return NextResponse.json({success: true, data});
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
