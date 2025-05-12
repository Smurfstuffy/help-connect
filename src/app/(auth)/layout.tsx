'use client';
import {Button} from '@/components/ui/button';
import {supabase} from '@/lib/supabase';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {Tables} from '@/types/supabase/database.types';
import axios from 'axios';

type UserProfile = Tables<'user_profiles'>;

export default function AuthLayout({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: {user: authUser},
      } = await supabase.auth.getUser();
      if (authUser) {
        try {
          const {data: result} = await axios.get(
            `/api/user-profile/${authUser.id}`,
          );
          if (result.success) {
            setUser(result.data);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between py-4">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold">
                  Help Connect
                </Link>
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
      <main>{children}</main>
    </div>
  );
}
