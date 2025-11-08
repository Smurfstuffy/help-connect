'use client';
import {useState, useRef, useEffect} from 'react';
import {Button} from './ui/button';
import {Card, CardContent, CardHeader, CardTitle} from './ui/card';
import {ScrollArea} from './ui/scroll-area';
import {Textarea} from './ui/textarea';
import {useSupabaseChat} from '@/hooks/useSupabaseChat';
import {useAuth} from '@/hooks/useAuth';
import {MessageCircle, Users, User, AlertTriangle, Send} from 'lucide-react';

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
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="justify-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Chat
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-gray-600 font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </CardTitle>
        {onlineUsers.length > 0 && (
          <div className="text-sm text-gray-600 flex items-center gap-1">
            <Users className="w-4 h-4" />
            {onlineUsers.length} user{onlineUsers.length !== 1 ? 's' : ''}{' '}
            online
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea ref={scrollAreaRef} className="h-96">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No messages yet
              </h3>
              <p className="text-gray-500">Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={msg.id || i}
                className={`mb-4 ${msg.senderId === userId ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`text-xs text-gray-500 mb-1 flex items-center gap-1 ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                >
                  <User className="w-3 h-3" />
                  {msg.senderName} •{' '}
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
                <div
                  className={`inline-block px-4 py-3 rounded-2xl max-w-xs shadow-sm ${
                    msg.senderId === userId
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
        <div className="mt-4 space-y-3">
          <Textarea
            placeholder="Write a message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            rows={3}
          />
          <Button
            className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSendMessage}
            disabled={!message.trim() || !isConnected}
          >
            {!isConnected ? (
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Disconnected
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chat;
