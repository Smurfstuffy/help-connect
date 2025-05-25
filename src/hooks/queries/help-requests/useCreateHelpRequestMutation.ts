import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
  createHelpRequest,
  HelpRequestInsert,
} from '@/services/supabase/help-request/create';

export const useCreateHelpRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: HelpRequestInsert) => createHelpRequest(user),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['help-requests']});
    },
  });
};
