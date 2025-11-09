import ConversationList from '@/components/ConversationList';

const ChatsPage = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
        <ConversationList />
      </div>
    </div>
  );
};

export default ChatsPage;
