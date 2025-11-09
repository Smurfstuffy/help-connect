import {ScrollArea} from './ui/scroll-area';
import HelpRequestCard from './HelpRequestCard';
import {HelpRequest} from '@/types/app/api';
import {FC} from 'react';
import {FileText} from 'lucide-react';

interface HelpRequestListProps {
  helpRequests: HelpRequest[];
  isLoading: boolean;
}

const HelpRequestList: FC<HelpRequestListProps> = ({
  helpRequests,
  isLoading,
}: HelpRequestListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading help requests...</span>
      </div>
    );
  }

  if (!helpRequests || helpRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No help requests found
        </h3>
        <p className="text-gray-500">Be the first to create a help request!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full flex flex-col w-full">
      <div className="flex flex-col gap-4 pb-4 px-4">
        {helpRequests?.map((helpRequest, index) => (
          <div
            key={helpRequest.id}
            className="animate-fade-in"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <HelpRequestCard helpRequest={helpRequest} />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default HelpRequestList;
