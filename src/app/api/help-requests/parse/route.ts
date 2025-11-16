import {NextRequest, NextResponse} from 'next/server';
import {parseHelpRequest} from '@/services/openai/help-requests/parseHelpRequest';
import {ApiResponse} from '@/types/app/api';
import {
  ParsedHelpRequest,
  ParseHelpRequestError,
} from '@/services/openai/help-requests/parseHelpRequest';

export async function POST(
  request: NextRequest,
): Promise<
  NextResponse<ApiResponse<ParsedHelpRequest | ParseHelpRequestError>>
> {
  try {
    const body = await request.json();
    const {text} = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Text is required',
        },
        {status: 400},
      );
    }

    const result = await parseHelpRequest(text.trim());

    if ('error' in result && result.error) {
      return NextResponse.json({
        success: false,
        error: result.message,
        data: result,
      });
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {status: 500},
    );
  }
}
