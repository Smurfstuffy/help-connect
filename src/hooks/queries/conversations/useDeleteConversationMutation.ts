import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deleteConversation} from '@/services/axios/conversations/deleteConversation';

export const useDeleteConversationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      userId,
    }: {
      id: string;
      userId: string;
      userRole: string;
    }) => deleteConversation(id, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['conversations', variables.userId, variables.userRole],
      });
    },
  });
};
