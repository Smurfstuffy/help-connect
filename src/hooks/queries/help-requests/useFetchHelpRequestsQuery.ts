import {useQuery} from '@tanstack/react-query';
import {fetchHelpRequests} from '@/services/api/help-requests/fetchHelpRequests';

export const useFetchHelpRequestsQuery = () => {
  return useQuery({
    queryKey: ['help-requests'],
    queryFn: () => fetchHelpRequests(),
  });
};
