'use client';
import {useFetchConversationsQuery} from '@/hooks/queries/conversations/useFetchConversationsQuery';
import {useFetchUserQuery} from '@/hooks/queries/user-profiles/useFetchUserQuery';
import {useAuth} from '@/hooks/useAuth';
import {Card, CardContent, CardHeader, CardTitle} from './ui/card';
import Link from 'next/link';
import {UserRole} from '@/types/app/register';

const ConversationList = () => {
  const {userId} = useAuth();
  const {data: currentUser} = useFetchUserQuery(userId ?? '');

  const {
    data: conversations,
    isLoading,
    error,
  } = useFetchConversationsQuery(userId ?? '', currentUser?.role ?? '');

  if (isLoading) return <div className="p-4">Loading conversations...</div>;
  if (error) return <div className="p-4">Error loading conversations</div>;
  if (!conversations || conversations.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Your Chats</h2>
        <p className="text-gray-500">No conversations yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Your Chats</h2>
      <div className="space-y-4">
        {conversations.map(conversation => {
          // Determine the other participant's name
          const otherParticipant =
            currentUser?.role === UserRole.VOLUNTEER
              ? conversation.user_profiles
              : conversation.volunteer_profiles;

          const otherParticipantName = otherParticipant
            ? `${otherParticipant.name || ''} ${otherParticipant.surname || ''}`.trim()
            : 'Unknown User';

          return (
            <Link key={conversation.id} href={`/chats/${conversation.id}`}>
              <Card className="cursor-pointer hover:bg-accent/90 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {conversation.name || `Chat with ${otherParticipantName}`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {currentUser?.role === UserRole.VOLUNTEER
                      ? 'Helping'
                      : 'Getting help from'}
                    : {otherParticipantName}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Started:{' '}
                    {new Date(conversation.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
