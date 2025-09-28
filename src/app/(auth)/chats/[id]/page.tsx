import Chat from '@/components/Chat';

interface ChatPageProps {
  params: Promise<{id: string}>;
}

const ChatPage = async ({params}: ChatPageProps) => {
  const {id} = await params;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Chat
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect and coordinate help with your conversation partner.
        </p>
      </div>

      {/* Chat Component */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
        <Chat conversationId={id} />
      </div>
    </div>
  );
};

export default ChatPage;
