import {useInfiniteQuery} from '@tanstack/react-query';
import {fetchHelpRequests} from '@/services/axios/help-requests/fetchHelpRequests';
import {HelpRequestFilters} from '@/services/supabase/help-request/fetch';

const PAGE_SIZE = 10;

export const useFetchHelpRequestsInfiniteQuery = (
  filters?: HelpRequestFilters,
  pageSize: number = PAGE_SIZE,
) => {
  return useInfiniteQuery({
    queryKey: ['help-requests', 'infinite', filters],
    queryFn: ({pageParam = 0}) =>
      fetchHelpRequests({
        ...filters,
        offset: pageParam,
        limit: pageSize,
      }),
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer items than pageSize, we've reached the end
      if (!lastPage || lastPage.length < pageSize) {
        return undefined;
      }
      // Return the next offset
      return allPages.length * pageSize;
    },
    initialPageParam: 0,
    staleTime: 30000, // Data stays fresh for 30 seconds
  });
};
