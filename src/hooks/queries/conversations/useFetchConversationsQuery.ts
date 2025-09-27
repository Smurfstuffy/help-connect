import {useQuery} from '@tanstack/react-query';
import {ConversationWithUsers, ApiResponse} from '@/types/chat';

const fetchConversations = async (
  userId: string,
  userRole: string,
): Promise<ConversationWithUsers[]> => {
  const response = await fetch(
    `/api/conversations?userId=${userId}&userRole=${userRole}`,
  );
  const result: ApiResponse<ConversationWithUsers[]> = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch conversations');
  }

  return result.data || [];
};

export const useFetchConversationsQuery = (
  userId: string,
  userRole: string,
) => {
  return useQuery({
    queryKey: ['conversations', userId, userRole],
    queryFn: () => fetchConversations(userId, userRole),
    enabled: !!userId && !!userRole,
  });
};
