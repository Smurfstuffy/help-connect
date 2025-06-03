'use client';
import {useFetchConversationByIdQuery} from '@/hooks/queries/conversations/useFetchConversationByIdQuery';
import {useAuth} from '@/hooks/useAuth';

const ConversationList = () => {
  const {userId} = useAuth();
  const {data: conversations, isLoading} = useFetchConversationByIdQuery(
    userId ?? '',
  );
  console.log(conversations);
  if (isLoading) return <div>Loading...</div>;
  return <div>ConversationList</div>;
};

export default ConversationList;
