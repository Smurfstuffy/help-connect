import {useQuery} from '@tanstack/react-query';
import {fetchHelpRequests} from '@/services/axios/help-requests/fetchHelpRequests';
import {HelpRequestFilters} from '@/services/supabase/help-request/fetch';

export const useFetchHelpRequestsByUserIdQuery = (
  userId: string,
  filters?: Omit<HelpRequestFilters, 'userId'>,
) => {
  return useQuery({
    queryKey: ['help-requests-by-user', userId, filters],
    queryFn: () => fetchHelpRequests({...filters, userId}),
    enabled: !!userId,
  });
};
