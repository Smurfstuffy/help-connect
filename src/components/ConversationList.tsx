'use client';
import {useState, useMemo} from 'react';
import {useFetchConversationsQuery} from '@/hooks/queries/conversations/useFetchConversationsQuery';
import {useFetchUserQuery} from '@/hooks/queries/user-profiles/useFetchUserQuery';
import {useAuth} from '@/hooks/useAuth';
import {Card, CardContent, CardHeader, CardTitle} from './ui/card';
import {Button} from './ui/button';
import {Input} from './ui/input';
import Link from 'next/link';
import {UserRole} from '@/types/app/register';
import {
  AlertTriangle,
  MessageCircle,
  Calendar,
  Trash2,
  Search,
} from 'lucide-react';
import {useDeleteConversationMutation} from '@/hooks/queries/conversations/useDeleteConversationMutation';
import {useLanguage} from '@/contexts/LanguageContext';
import PostChatDeletionDialog from './PostChatDeletionDialog';

const ConversationList = () => {
  const {userId} = useAuth();
  const {t} = useLanguage();
  const {data: currentUser} = useFetchUserQuery(userId ?? '');
  const {mutateAsync: deleteConversation, isPending: isDeleting} =
    useDeleteConversationMutation();
  const [deletedConversation, setDeletedConversation] = useState<{
    helpRequestId: string | null;
    open: boolean;
  }>({helpRequestId: null, open: false});
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: conversations,
    isLoading,
    error,
  } = useFetchConversationsQuery(userId ?? '', currentUser?.role ?? '');

  const filteredConversations = useMemo(() => {
    if (!conversations || !searchQuery.trim()) {
      return conversations || [];
    }

    const query = searchQuery.toLowerCase().trim();
    return conversations.filter(conversation => {
      const title = conversation.name?.toLowerCase() || '';
      return title.includes(query);
    });
  }, [conversations, searchQuery]);

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">
            {t('conversations.loading')}
          </span>
        </div>
        <PostChatDeletionDialog
          open={deletedConversation.open}
          onOpenChange={open =>
            setDeletedConversation(prev => ({...prev, open}))
          }
          helpRequestId={deletedConversation.helpRequestId}
          userRole={currentUser?.role ?? ''}
        />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('conversations.error')}
          </h3>
          <p className="text-gray-500">{t('conversations.refresh')}</p>
        </div>
        <PostChatDeletionDialog
          open={deletedConversation.open}
          onOpenChange={open =>
            setDeletedConversation(prev => ({...prev, open}))
          }
          helpRequestId={deletedConversation.helpRequestId}
          userRole={currentUser?.role ?? ''}
        />
      </>
    );
  }

  const hasConversations = conversations && conversations.length > 0;
  const hasFilteredResults = filteredConversations.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder={t('conversations.searchPlaceholder')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      <div className="flex flex-col gap-4">
        {!hasConversations ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('conversations.noConversations')}
            </h3>
            <p className="text-gray-500">
              {t('conversations.startConversation')}
            </p>
          </div>
        ) : !hasFilteredResults ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('conversations.noResults')}
            </h3>
            <p className="text-gray-500">{t('conversations.adjustSearch')}</p>
          </div>
        ) : (
          filteredConversations.map((conversation, index) => {
            // Determine the other participant's name
            const otherParticipant =
              currentUser?.role === UserRole.VOLUNTEER
                ? conversation.user_profiles
                : conversation.volunteer_profiles;

            const otherParticipantName = otherParticipant
              ? `${otherParticipant.name || ''} ${otherParticipant.surname || ''}`.trim()
              : t('conversations.unknownUser');

            return (
              <div
                key={conversation.id}
                className="relative group animate-fade-in hover:scale-[1.02] transition-all duration-300"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <Link href={`/chats/${conversation.id}`}>
                  <Card className="cursor-pointer hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader className="relative">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MessageCircle className="w-6 h-6" />
                        {conversation.name ||
                          `${t('conversations.chatWith')} ${otherParticipantName}`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        {currentUser?.role === UserRole.VOLUNTEER
                          ? t('conversations.helping')
                          : t('conversations.gettingHelp')}
                        : {otherParticipantName}
                      </p>
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {t('conversations.started')}{' '}
                        {new Date(conversation.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                <Button
                  type="button"
                  className="absolute top-2 right-2 cursor-pointer bg-transparent hover:bg-red-100 text-red-600 p-2 h-8 w-8 border-0 shadow-none transition-all duration-300"
                  onClick={async e => {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                      await deleteConversation({
                        id: conversation.id,
                        userId: userId!,
                        userRole: currentUser?.role ?? '',
                      });
                      console.log(
                        'Chat deleted successfully, helpRequestId:',
                        conversation.help_request_id,
                      );
                      setDeletedConversation({
                        helpRequestId: conversation.help_request_id,
                        open: true,
                      });
                    } catch (error) {
                      console.error('Error deleting chat:', error);
                    }
                  }}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            );
          })
        )}
      </div>
      <PostChatDeletionDialog
        open={deletedConversation.open}
        onOpenChange={open => setDeletedConversation(prev => ({...prev, open}))}
        helpRequestId={deletedConversation.helpRequestId}
        userRole={currentUser?.role ?? ''}
      />
    </div>
  );
};

export default ConversationList;
