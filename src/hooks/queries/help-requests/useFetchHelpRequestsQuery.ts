import {useQuery} from '@tanstack/react-query';
import {fetchHelpRequests} from '@/services/axios/help-requests/fetchHelpRequests';

export const useFetchHelpRequestsQuery = () => {
  return useQuery({
    queryKey: ['help-requests'],
    queryFn: () => fetchHelpRequests(),
  });
};
