import {useMutation, useQueryClient} from '@tanstack/react-query';
import {changeClosedStatusById} from '@/services/axios/help-requests/changeClosedStatusById';

export const useChangeClosedStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => changeClosedStatusById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['help-requests']});
    },
  });
};
