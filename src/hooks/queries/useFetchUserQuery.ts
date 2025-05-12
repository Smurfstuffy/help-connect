import {useQuery} from '@tanstack/react-query';
import {fetchUser} from '@/services/api/fetchUser';

export const useFetchUserQuery = (userId: string) => {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });
};
