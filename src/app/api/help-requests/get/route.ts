import {NextRequest, NextResponse} from 'next/server';
import {ApiResponse, HelpRequest} from '@/types/app/api';
import {
  getHelpRequest,
  HelpRequestFilters,
} from '@/services/supabase/help-request/fetch';

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<HelpRequest[]>>> {
  try {
    const {searchParams} = new URL(request.url);

    const filters: HelpRequestFilters = {};

    // Parse query parameters
    if (searchParams.has('userId')) {
      filters.userId = searchParams.get('userId') || undefined;
    }

    if (searchParams.has('category')) {
      filters.category = searchParams.get('category') || undefined;
    }

    if (searchParams.has('urgency')) {
      filters.urgency = searchParams.get('urgency') || undefined;
    }

    if (searchParams.has('is_closed')) {
      const isClosed = searchParams.get('is_closed');
      filters.is_closed = isClosed === 'true';
    }

    if (searchParams.has('city')) {
      filters.city = searchParams.get('city') || undefined;
    }

    if (searchParams.has('search')) {
      filters.search = searchParams.get('search') || undefined;
    }

    if (searchParams.has('minDate')) {
      filters.minDate = searchParams.get('minDate') || undefined;
    }

    if (searchParams.has('maxDate')) {
      filters.maxDate = searchParams.get('maxDate') || undefined;
    }

    if (searchParams.has('offset')) {
      const offset = parseInt(searchParams.get('offset') || '0', 10);
      if (!isNaN(offset)) {
        filters.offset = offset;
      }
    }

    if (searchParams.has('limit')) {
      const limit = parseInt(searchParams.get('limit') || '10', 10);
      if (!isNaN(limit)) {
        filters.limit = limit;
      }
    }

    const data = await getHelpRequest(
      Object.keys(filters).length > 0 ? filters : undefined,
    );
    return NextResponse.json({success: true, data: data ?? []});
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({success: false, error: message}, {status: 500});
  }
}
