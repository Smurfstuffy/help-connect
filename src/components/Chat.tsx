'use client';
import {useEffect, useState} from 'react';
import {Button} from './ui/button';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from './ui/card';
import {ScrollArea} from './ui/scroll-area';
import {Textarea} from './ui/textarea';
import {ChatMessage} from '@/types/app/chat';
import {supabase} from '@/lib/supabase';
import {useAuth} from '@/hooks/useAuth';
import {useFetchUserQuery} from '@/hooks/queries/useFetchUserQuery';

const Chat = () => {
  const {userId} = useAuth();
  const {data: user} = useFetchUserQuery(userId ?? '');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const roomId = 'room1'; // hardcoded chat room/channel

  useEffect(() => {
    const channel = supabase.channel(`chat-room-${roomId}`);

    // Listen for incoming messages from others
    channel
      .on('broadcast', {event: 'new-message'}, ({payload}) => {
        setMessages(prev => [...prev, payload as ChatMessage]);
      })
      .subscribe();

    return () => {
      // Clean up when component unmounts
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      text: message,
      senderId: userId ?? '',
      senderName: `${user?.name} ${user?.surname}`,
      timestamp: new Date().toISOString(),
    };

    supabase.channel(`chat-room-${roomId}`).send({
      type: 'broadcast',
      event: 'new-message',
      payload: newMessage,
    });

    setMessages(prev => [...prev, newMessage]); // optimistic UI update
    setMessage('');
  };

  return (
    <Card>
      <CardHeader className="justify-center">
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 ${msg.senderId === userId ? 'text-right' : 'text-left'}`}
            >
              <span className="text-sm text-gray-500">{msg.senderName}</span>
              <div className="bg-gray-100 inline-block px-3 py-1 rounded">
                {msg.text}
              </div>
            </div>
          ))}
        </ScrollArea>
        <Textarea
          placeholder="Write a message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
      </CardContent>
      <CardFooter className="justify-center">
        <Button className="w-full cursor-pointer" onClick={sendMessage}>
          Send
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Chat;
