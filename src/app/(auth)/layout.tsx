'use client';
import {Button} from '@/components/ui/button';
import {supabase} from '@/lib/supabase';
import Link from 'next/link';
import {useRouter, usePathname} from 'next/navigation';
import {useFetchUserQuery} from '@/hooks/queries/user-profiles/useFetchUserQuery';
import {useAuth} from '@/hooks/useAuth';
import {useLanguage} from '@/contexts/LanguageContext';
import {UserRole} from '@/types/app/register';
import Chatbot from '@/components/Chatbot';

export default function AuthLayout({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const pathname = usePathname();
  const {userId} = useAuth();
  const {language, setLanguage, t} = useLanguage();

  const {data: user} = useFetchUserQuery(userId ?? '');

  // Check if we're on a chat page (should not show chatbot there)
  const isChatPage = pathname?.startsWith('/chats/') && pathname !== '/chats';

  // Show chatbot only for USER and VOLUNTEER roles, and not on individual chat pages
  const shouldShowChatbot =
    user &&
    (user.role === UserRole.USER || user.role === UserRole.VOLUNTEER) &&
    !isChatPage;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col overflow-hidden">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-lg z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between py-4">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-normal"
                >
                  Help Connect
                </Link>
                {user && user.role === UserRole.USER && (
                  <Link
                    href="/my-help-requests"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-md font-medium transition-colors leading-normal"
                  >
                    {t('nav.myRequests')}
                  </Link>
                )}
                <Link
                  href="/chats"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-md font-medium transition-colors leading-normal"
                >
                  {t('nav.chats')}
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <Link
                  href="/settings"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-md font-medium transition-colors leading-normal"
                >
                  {user.name} {user.surname}
                </Link>
              )}
              {/* Language Switch */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'ua' : 'en')}
                className="flex items-center justify-center gap-1 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-lg py-1 shadow-sm cursor-pointer hover:bg-white/80 transition-all duration-200 h-9 min-h-9"
              >
                <span
                  className={`px-2.5 py-2 text-sm font-medium transition-all duration-200 rounded-md flex items-center justify-center ${
                    language === 'en'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-500'
                  }`}
                >
                  EN
                </span>
                <span
                  className={`px-2.5 py-2 text-sm font-medium transition-all duration-200 rounded-md flex items-center justify-center ${
                    language === 'ua'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-500'
                  }`}
                >
                  UA
                </span>
              </button>
              <Button
                className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={handleLogout}
              >
                {t('nav.logout')}
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col min-h-0">
        {children}
      </main>
      {shouldShowChatbot && <Chatbot />}
    </div>
  );
}
