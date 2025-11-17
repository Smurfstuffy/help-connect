import {useInfiniteQuery} from '@tanstack/react-query';
import {fetchMessages} from '@/services/axios/messages/fetchMessages';

const PAGE_SIZE = 20;

export const useFetchMessagesInfiniteQuery = (
  conversationId: string,
  pageSize: number = PAGE_SIZE,
) => {
  return useInfiniteQuery({
    queryKey: ['messages', 'infinite', conversationId],
    queryFn: ({pageParam = 0}) =>
      fetchMessages({
        conversationId,
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
    enabled: !!conversationId, // Only run if conversationId is provided
  });
};
