'use client';
import {useEffect, useState} from 'react';
import {Button} from './ui/button';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from './ui/card';
import {ScrollArea} from './ui/scroll-area';
import {Textarea} from './ui/textarea';
import {supabase} from '@/lib/supabase';
// import {useAuth} from '@/hooks/useAuth';
//import {useFetchUserQuery} from '@/hooks/queries/user-profiles/useFetchUserQuery';
// import {ChatMessage} from '@/types/app/api';

interface testMessage {
  sender: string;
  text: string;
}

const Chat = () => {
  const [message, setMessage] = useState<testMessage>({
    sender: 'receiver',
    text: '',
  });
  const [tempConversation, setTempConversation] = useState<testMessage[]>([
    {sender: 'sender', text: 'Hello, how are you doing?'},
    {
      sender: 'receiver',
      text: 'I am doing fine, thank you for asking, and how are you doing?',
    },
    {
      sender: 'sender',
      text: 'Good. I can help you with your problem ,can you give me your phone number and we can talk about the details?',
    },
    {
      sender: 'receiver',
      text: 'Sure, my phone number is +380631234321. I am looking forward to hearing from you soon, Thank you for the response.',
    },
    {sender: 'sender', text: 'No problem. I will call you as soon as I can.'},
    {sender: 'receiver', text: 'Thank you.'},
  ]);
  // const {userId} = useAuth();
  // const {data: user} = useFetchUserQuery(userId ?? '');
  // const [message, setMessage] = useState<string>('');
  // const [messages, setMessages] = useState<ChatMessage[]>([]);
  const roomId = 'room1'; // hardcoded chat room/channel

  useEffect(() => {
    const channel = supabase.channel(`chat-room-${roomId}`);

    // Listen for incoming messages from others
    // channel
    //   .on('broadcast', {event: 'new-message'}, ({payload}) => {
    //     setMessages(prev => [...prev, payload as ChatMessage]);
    //   })
    //   .subscribe();

    return () => {
      // Clean up when component unmounts
      supabase.removeChannel(channel);
    };
  }, []);

  // const sendMessage = () => {
  //   if (!message.trim()) return;

  //   const newMessage: ChatMessage = {
  //     text: message,
  //     senderId: userId ?? '',
  //     senderName: `${user?.name} ${user?.surname}`,
  //     timestamp: new Date().toISOString(),
  //   };

  //   supabase.channel(`chat-room-${roomId}`).send({
  //     type: 'broadcast',
  //     event: 'new-message',
  //     payload: newMessage,
  //   });

  //   setMessages(prev => [...prev, newMessage]); // optimistic UI update
  //   setMessage('');
  // };

  const sendMessage = () => {
    setTempConversation(prev => [...prev, message]);
  };

  return (
    <Card>
      <CardHeader className="justify-center">
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          {/* {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 ${msg.senderId === userId ? 'text-right' : 'text-left'}`}
            >
              <span className="text-sm text-gray-500">{msg.senderName}</span>
              <div className="bg-gray-100 inline-block px-3 py-1 rounded">
                {msg.text}
              </div>
            </div>
          ))} */}
          {tempConversation.map((msg, i) => (
            <div
              key={i}
              className={`flex-wrap mb-2 ${msg.sender === 'receiver' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`${msg.sender === 'receiver' ? 'bg-blue-200' : 'bg-gray-200'} inline-block px-3 py-1 rounded max-w-2/5`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </ScrollArea>
        <Textarea
          placeholder="Write a message..."
          value={message.text}
          onChange={e => setMessage({sender: 'receiver', text: e.target.value})}
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
