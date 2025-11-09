'use client';
import {useState} from 'react';
import HelpRequestList from '@/components/HelpRequestList';
import HelpRequestFilters from '@/components/HelpRequestFilters';
import {useFetchHelpRequestsByUserIdQuery} from '@/hooks/queries/help-requests/useFetchHelpRequestsByUserIdQuery';
import {useAuth} from '@/hooks/useAuth';
import {HelpRequestFilters as HelpRequestFiltersType} from '@/services/supabase/help-request/fetch';

const MyHelpRequestsPage = () => {
  const {userId} = useAuth();
  const [filters, setFilters] = useState<
    Omit<HelpRequestFiltersType, 'userId'>
  >({});
  const {data: helpRequests, isLoading} = useFetchHelpRequestsByUserIdQuery(
    userId ?? '',
    filters,
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-normal pb-1">
          My Help Requests
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Manage and track your help requests and see responses from volunteers.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
        <HelpRequestFilters filters={filters} onFiltersChange={setFilters} />
        <HelpRequestList
          helpRequests={helpRequests ?? []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default MyHelpRequestsPage;
