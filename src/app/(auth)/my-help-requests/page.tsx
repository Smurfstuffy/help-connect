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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Help Requests
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage and track your help requests and see responses from volunteers.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
        <HelpRequestList
          helpRequests={helpRequests ?? []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default MyHelpRequestsPage;
