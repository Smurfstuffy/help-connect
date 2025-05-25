'use client';
import {useFetchHelpRequestsQuery} from '@/hooks/queries/help-requests/useFetchHelpRequestsQuery';
import {ScrollArea} from './ui/scroll-area';
import HelpRequestCard from './HelpRequestCard';

const HelpRequestList = () => {
  const {data: helpRequests} = useFetchHelpRequestsQuery();
  return (
    <ScrollArea className="h-full flex flex-col px-8 w-full">
      <div className="flex flex-col gap-4">
        {helpRequests?.map(helpRequest => (
          <HelpRequestCard key={helpRequest.id} helpRequest={helpRequest} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default HelpRequestList;
