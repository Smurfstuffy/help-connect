'use client';
import HelpRequestList from '@/components/HelpRequestList';
import RequestDialog from '@/components/RequestDialog';
import {useFetchHelpRequestsQuery} from '@/hooks/queries/help-requests/useFetchHelpRequestsQuery';
import {useAuth} from '@/hooks/useAuth';
import {useFetchUserQuery} from '@/hooks/queries/user-profiles/useFetchUserQuery';
import {UserRole} from '@/types/app/register';

export default function Home() {
  const {userId} = useAuth();
  const {data: user} = useFetchUserQuery(userId ?? '');
  const {data: helpRequests, isLoading} = useFetchHelpRequestsQuery();
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Help Connect
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with volunteers and get the help you need, or offer your
          assistance to those in need.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
        {user?.role === UserRole.USER && (
          <div className="flex justify-center mb-6">
            <RequestDialog />
          </div>
        )}
        <HelpRequestList
          helpRequests={helpRequests ?? []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
