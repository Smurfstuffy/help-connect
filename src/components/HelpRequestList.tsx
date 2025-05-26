import {ScrollArea} from './ui/scroll-area';
import HelpRequestCard from './HelpRequestCard';
import {HelpRequest} from '@/types/app/api';
import {FC} from 'react';

interface HelpRequestListProps {
  helpRequests: HelpRequest[];
  isLoading: boolean;
}

const HelpRequestList: FC<HelpRequestListProps> = ({
  helpRequests,
  isLoading,
}: HelpRequestListProps) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

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
