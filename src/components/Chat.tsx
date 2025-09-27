'use client';
import {useState, useRef, useEffect} from 'react';
import {Button} from './ui/button';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from './ui/card';
import {ScrollArea} from './ui/scroll-area';
import {Textarea} from './ui/textarea';
import {useSupabaseChat} from '@/hooks/useSupabaseChat';
import {useAuth} from '@/hooks/useAuth';

interface ChatProps {
  conversationId?: string;
}

const Chat = ({conversationId = 'default-room'}: ChatProps) => {
  const {userId} = useAuth();
  const [message, setMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isConnected,
    isLoadingMessages,
    onlineUsers,
    sendMessage: sendChatMessage,
  } = useSupabaseChat({conversationId});

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]',
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    sendChatMessage(message);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card>
      <CardHeader className="justify-center">
        <CardTitle className="flex items-center justify-between">
          <span>Chat</span>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-gray-500">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </CardTitle>
        {onlineUsers.length > 0 && (
          <div className="text-sm text-gray-500">
            {onlineUsers.length} user{onlineUsers.length !== 1 ? 's' : ''}{' '}
            online
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea ref={scrollAreaRef} className="h-96">
          {isLoadingMessages ? (
            <div className="text-center text-gray-500 py-8">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={msg.id || i}
                className={`mb-2 ${msg.senderId === userId ? 'text-right' : 'text-left'}`}
              >
                <div className="text-xs text-gray-500 mb-1">
                  {msg.senderName} •{' '}
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
                <div
                  className={`inline-block px-3 py-2 rounded-lg max-w-xs ${
                    msg.senderId === userId
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
        <Textarea
          placeholder="Write a message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="mt-4"
        />
      </CardContent>
      <CardFooter className="justify-center">
        <Button
          className="w-full cursor-pointer"
          onClick={handleSendMessage}
          disabled={!message.trim() || !isConnected}
        >
          Send
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Chat;
