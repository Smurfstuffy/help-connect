import {useQuery} from '@tanstack/react-query';
import {fetchHelpRequestsByUserId} from '@/services/axios/help-requests/fetchHelpRequestsById';

export const useFetchHelpRequestsByUserIdQuery = (userId: string) => {
  return useQuery({
    queryKey: ['help-requests-by-user', userId],
    queryFn: () => fetchHelpRequestsByUserId(userId),
    enabled: !!userId,
  });
};
