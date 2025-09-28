'use client';
import {Button} from '@/components/ui/button';
import {supabase} from '@/lib/supabase';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useFetchUserQuery} from '@/hooks/queries/user-profiles/useFetchUserQuery';
import {useAuth} from '@/hooks/useAuth';
import {UserRole} from '@/types/app/register';

export default function AuthLayout({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const {userId} = useAuth();

  const {data: user} = useFetchUserQuery(userId ?? '');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between py-4">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                  Help Connect
                </Link>
                {user && user.role === UserRole.USER && (
                  <Link
                    href="/my-help-requests"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-md font-medium transition-colors"
                  >
                    My Requests
                  </Link>
                )}
                <Link
                  href="/chats"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-md font-medium transition-colors"
                >
                  Chats
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <Link
                  href="/settings"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-md font-medium transition-colors"
                >
                  {user.name} {user.surname}
                </Link>
              )}
              <Button
                className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {children}
      </main>
    </div>
  );
}
