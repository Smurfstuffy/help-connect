import {useMutation} from '@tanstack/react-query';
import {createUser} from '@/services/axios/user-profiles/createUser';
import {UserInsert} from '@/services/supabase/user/create';

export const useCreateUserMutation = () => {
  return useMutation({
    mutationFn: (user: UserInsert) => createUser(user),
  });
};
