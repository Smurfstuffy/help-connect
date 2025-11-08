import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deleteHelpRequest} from '@/services/axios/help-requests/deleteHelpRequest';

export const useDeleteHelpRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, userId}: {id: string; userId: string}) =>
      deleteHelpRequest(id, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['help-requests']});
      queryClient.invalidateQueries({
        queryKey: ['help-requests-by-user', variables.userId],
      });
    },
  });
};
