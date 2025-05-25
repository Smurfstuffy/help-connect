'use client';
import HelpRequestList from '@/components/HelpRequestList';
import RequestDialog from '@/components/RequestDialog';
import {useFetchHelpRequestsQuery} from '@/hooks/queries/help-requests/useFetchHelpRequestsQuery';

export default function Home() {
  const {data: helpRequests, isLoading} = useFetchHelpRequestsQuery();
  return (
    <div className="h-full flex flex-col gap-4 py-4 justify-center items-center">
      <RequestDialog />
      <HelpRequestList
        helpRequests={helpRequests ?? []}
        isLoading={isLoading}
      />
    </div>
  );
}
