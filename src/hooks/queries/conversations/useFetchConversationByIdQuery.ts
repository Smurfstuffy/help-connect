import {useQuery} from '@tanstack/react-query';
import {fetchConversationById} from '@/services/axios/conversations/fetchConversationById';

export const useFetchConversationByIdQuery = (userId: string) => {
  return useQuery({
    queryKey: ['conversations', userId],
    queryFn: () => fetchConversationById(userId),
    enabled: !!userId,
  });
};
