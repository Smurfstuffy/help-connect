'use client';
import {useState} from 'react';
import {useFetchConversationsQuery} from '@/hooks/queries/conversations/useFetchConversationsQuery';
import {useFetchUserQuery} from '@/hooks/queries/user-profiles/useFetchUserQuery';
import {useAuth} from '@/hooks/useAuth';
import {Card, CardContent, CardHeader, CardTitle} from './ui/card';
import {Button} from './ui/button';
import Link from 'next/link';
import {UserRole} from '@/types/app/register';
import {AlertTriangle, MessageCircle, Calendar, Trash2} from 'lucide-react';
import {useDeleteConversationMutation} from '@/hooks/queries/conversations/useDeleteConversationMutation';
import PostChatDeletionDialog from './PostChatDeletionDialog';

const ConversationList = () => {
  const {userId} = useAuth();
  const {data: currentUser} = useFetchUserQuery(userId ?? '');
  const {mutateAsync: deleteConversation, isPending: isDeleting} =
    useDeleteConversationMutation();
  const [deletedConversation, setDeletedConversation] = useState<{
    helpRequestId: string | null;
    open: boolean;
  }>({helpRequestId: null, open: false});

  const {
    data: conversations,
    isLoading,
    error,
  } = useFetchConversationsQuery(userId ?? '', currentUser?.role ?? '');

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading conversations...</span>
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
            Error loading conversations
          </h3>
          <p className="text-gray-500">Please try refreshing the page.</p>
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

  if (!conversations || conversations.length === 0) {
    return (
      <>
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No conversations yet
          </h3>
          <p className="text-gray-500">
            Start a conversation by responding to a help request!
          </p>
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

  return (
    <div className="flex flex-col gap-4">
      {conversations.map((conversation, index) => {
        // Determine the other participant's name
        const otherParticipant =
          currentUser?.role === UserRole.VOLUNTEER
            ? conversation.user_profiles
            : conversation.volunteer_profiles;

        const otherParticipantName = otherParticipant
          ? `${otherParticipant.name || ''} ${otherParticipant.surname || ''}`.trim()
          : 'Unknown User';

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
                    {conversation.name || `Chat with ${otherParticipantName}`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    {currentUser?.role === UserRole.VOLUNTEER
                      ? 'Helping'
                      : 'Getting help from'}
                    : {otherParticipantName}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Started:{' '}
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
      })}
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
