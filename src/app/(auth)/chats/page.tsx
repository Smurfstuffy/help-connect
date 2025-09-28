import ConversationList from '@/components/ConversationList';

const ChatsPage = () => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Conversations
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect and communicate with volunteers or users to coordinate help.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
        <ConversationList />
      </div>
    </div>
  );
};

export default ChatsPage;
