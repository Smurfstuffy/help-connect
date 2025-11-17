'use client';
import {use} from 'react';
import Chat from '@/components/Chat';

interface ChatPageProps {
  params: Promise<{id: string}>;
}

const ChatPage = ({params}: ChatPageProps) => {
  const {id} = use(params);

  return (
    <div className="h-full flex flex-col">
      {/* Chat Component */}
      <div className="flex-1 flex flex-col min-h-0">
        <Chat conversationId={id} />
      </div>
    </div>
  );
};

export default ChatPage;
