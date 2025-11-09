import {useQuery} from '@tanstack/react-query';
import {fetchHelpRequests} from '@/services/axios/help-requests/fetchHelpRequests';
import {HelpRequestFilters} from '@/services/supabase/help-request/fetch';

export const useFetchHelpRequestsQuery = (filters?: HelpRequestFilters) => {
  return useQuery({
    queryKey: ['help-requests', filters],
    queryFn: () => fetchHelpRequests(filters),
  });
};
