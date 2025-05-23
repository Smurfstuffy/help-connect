import Chat from '@/components/Chat';

const ChatPage = () => {
  return (
    <div className="flex h-full w-full items-center justify-center p-4 md:p-16 lg:p-32">
      <div className="w-full max-w-7xl">
        <Chat />
      </div>
    </div>
  );
};

export default ChatPage;
