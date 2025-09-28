import Chat from '@/components/Chat';

interface ChatPageProps {
  params: Promise<{id: string}>;
}

const ChatPage = async ({params}: ChatPageProps) => {
  const {id} = await params;

  return (
    <div className="flex h-full w-full items-center justify-center p-4 md:p-16 lg:p-32">
      <div className="w-full max-w-7xl">
        <Chat conversationId={id} />
      </div>
    </div>
  );
};

export default ChatPage;
