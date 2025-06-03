import {useMutation, useQueryClient} from '@tanstack/react-query';
import {editUser} from '@/services/axios/user-profiles/editUser';
import {UserUpdate} from '@/services/supabase/user/edit';

export const useEditUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({userId, user}: {userId: string; user: UserUpdate}) =>
      editUser(userId, user),
    onSuccess: (data, variables) => {
      // Invalidate and refetch user profile data
      queryClient.invalidateQueries({
        queryKey: ['user-profile', variables.userId],
      });
    },
  });
};
