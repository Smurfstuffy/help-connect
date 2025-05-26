'use client';
import {Button} from '@/components/ui/button';
import {supabase} from '@/lib/supabase';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useFetchUserQuery} from '@/hooks/queries/useFetchUserQuery';
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
    <div className="h-screen flex flex-col">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between py-4">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center space-x-4">
                <Link href="/" className="text-xl font-bold">
                  Help Connect
                </Link>
                {user && user.role === UserRole.USER && (
                  <Link
                    href="/my-help-requests"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-md font-medium"
                  >
                    My Requests
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <Link
                  href="/settings"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-md font-medium"
                >
                  {user.name} {user.surname}
                </Link>
              )}
              <Button className="cursor-pointer" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}
