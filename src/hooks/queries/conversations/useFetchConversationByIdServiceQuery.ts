import {useQuery} from '@tanstack/react-query';
import {fetchConversationByIdService} from '@/services/axios/conversations/fetchConversationByIdService';

export const useFetchConversationByIdServiceQuery = (
  conversationId: string,
) => {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => fetchConversationByIdService(conversationId),
    enabled: !!conversationId,
  });
};
