'use client';
import HelpRequestList from '@/components/HelpRequestList';
import {useFetchHelpRequestsByUserIdQuery} from '@/hooks/queries/help-requests/useFetchHelpRequestsByUserIdQuery';
import {useAuth} from '@/hooks/useAuth';

const MyHelpRequestsPage = () => {
  const {userId} = useAuth();
  console.log(userId);
  const {data: helpRequests, isLoading} = useFetchHelpRequestsByUserIdQuery(
    userId ?? '',
  );
  return (
    <div className="h-full flex flex-col gap-4 py-4 justify-center items-center">
      <HelpRequestList
        helpRequests={helpRequests ?? []}
        isLoading={isLoading}
      />
    </div>
  );
};

export default MyHelpRequestsPage;
