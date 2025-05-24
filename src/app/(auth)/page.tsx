'use client';
import RequestDialog from '@/components/RequestDialog';
import {useFetchHelpRequestsQuery} from '@/hooks/queries/help-requests/useFetchHelpRequestsQuery';

export default function Home() {
  const {data: helpRequests} = useFetchHelpRequestsQuery();
  console.log(helpRequests);
  return (
    <div className="h-full flex justify-center items-center">
      <RequestDialog />
    </div>
  );
}
