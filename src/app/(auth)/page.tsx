'use client';
import {useState, useMemo} from 'react';
import HelpRequestList from '@/components/HelpRequestList';
import RequestDialog from '@/components/RequestDialog';
import HelpRequestFilters from '@/components/HelpRequestFilters';
import {useFetchHelpRequestsInfiniteQuery} from '@/hooks/queries/help-requests/useFetchHelpRequestsInfiniteQuery';
import {useAuth} from '@/hooks/useAuth';
import {useFetchUserQuery} from '@/hooks/queries/user-profiles/useFetchUserQuery';
import {UserRole} from '@/types/app/register';
import {HelpRequestFilters as HelpRequestFiltersType} from '@/services/supabase/help-request/fetch';

export default function Home() {
  const {userId} = useAuth();
  const {data: user, isLoading: isUserLoading} = useFetchUserQuery(
    userId ?? '',
  );
  const [filters, setFilters] = useState<HelpRequestFiltersType>({});
  const {data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage} =
    useFetchHelpRequestsInfiniteQuery(filters);

  // Flatten pages into single array, filtering out undefined values
  const helpRequests = useMemo(
    () =>
      data?.pages
        .flatMap(page => page ?? [])
        .filter(
          (item): item is NonNullable<typeof item> => item !== undefined,
        ) ?? [],
    [data],
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-normal pb-1">
          Help Connect
        </h1>
        {isUserLoading ? (
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-pulse">
            Connect with volunteers and get the help you need, or offer your
            assistance to those in need.
          </p>
        ) : user?.role === UserRole.USER ? (
          <div className="flex justify-center min-h-[40px] transition-all duration-300">
            <div className="opacity-0 animate-[fadeIn_0.3s_ease-in-out_0.1s_forwards]">
              <RequestDialog />
            </div>
          </div>
        ) : (
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed opacity-0 animate-[fadeIn_0.3s_ease-in-out_0.1s_forwards]">
            Connect with volunteers and get the help you need, or offer your
            assistance to those in need.
          </p>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
        <HelpRequestFilters filters={filters} onFiltersChange={setFilters} />
        <HelpRequestList
          helpRequests={helpRequests}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </div>
  );
}
