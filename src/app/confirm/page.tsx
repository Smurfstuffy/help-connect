'use client';
import Link from 'next/link';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {supabase} from '@/lib/supabase';
import {createUser} from '@/actions/user/create';

export default function ConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    const createUserProfile = async () => {
      try {
        // Get the current session
        const {
          data: {session},
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Get user metadata
          const metadata = session.user.user_metadata;

          // Create user profile using server action
          await createUser({
            id: session.user.id,
            name: metadata.name,
            surname: metadata.surname,
            role: metadata.role,
          });
        }
      } catch (error) {
        console.error('Error in profile creation:', error);
      }
    };

    createUserProfile();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-center text-md text-gray-600">
            We&apos;ve sent you an email with a confirmation link. Please check
            your inbox and click the link to verify your account.
          </p>
        </div>
        <div className="mt-4">
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}
