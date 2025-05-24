import {useMutation} from '@tanstack/react-query';
import {
  createHelpRequest,
  HelpRequestInsert,
} from '@/services/supabase/help-request/create';

export const useCreateHelpRequestMutation = () => {
  return useMutation({
    mutationFn: (user: HelpRequestInsert) => createHelpRequest(user),
  });
};
