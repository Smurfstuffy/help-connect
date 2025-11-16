import {useEffect, useState, useCallback} from 'react';
import {supabase} from '@/lib/supabase';
import {useAuth} from './useAuth';
import {useFetchUserQuery} from './queries/user-profiles/useFetchUserQuery';
import {
  ChatMessage,
  UseSupabaseChatOptions,
  UseSupabaseChatReturn,
  MessageWithUser,
  UserJoinedPayload,
  UserLeftPayload,
  NewMessagePayload,
} from '@/types/chat';

export const useSupabaseChat = ({
  conversationId,
  skipInitialLoad = false,
}: UseSupabaseChatOptions): UseSupabaseChatReturn => {
  const {userId} = useAuth();
  const {data: currentUser} = useFetchUserQuery(userId ?? '');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  // Load existing messages (only if not skipping initial load)
  const loadMessages = useCallback(async () => {
    if (!conversationId || skipInitialLoad) return;

    setIsLoadingMessages(true);
    try {
      const response = await fetch(
        `/api/messages?conversationId=${conversationId}`,
      );
      const result = await response.json();

      if (result.success) {
        // Transform the data to match our ChatMessage interface
        const transformedMessages = (result.data || []).map(
          (msg: MessageWithUser) => ({
            id: msg.id,
            text: msg.message_text || '',
            senderId: msg.sender_id || '',
            senderName:
              `${msg.user_profiles?.name || ''} ${msg.user_profiles?.surname || ''}`.trim(),
            timestamp: msg.created_at,
            conversationId: msg.conversation_id || '',
          }),
        );
        setMessages(transformedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [conversationId, skipInitialLoad]);

  // Send message
  const sendMessage = useCallback(
    async (text: string) => {
      if (!userId || !text.trim() || !currentUser) return;

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: text.trim(),
        senderId: userId,
        senderName: `${currentUser.name} ${currentUser.surname}`,
        timestamp: new Date().toISOString(),
        conversationId,
      };

      // Add to local state immediately for optimistic UI
      setMessages(prev => [...prev, newMessage]);

      try {
        // Save to database
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversationId,
            senderId: userId,
            text: text.trim(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(
            `Failed to save message: ${errorData.error || 'Unknown error'}`,
          );
        }

        const result = await response.json();
        console.log('Message saved successfully:', result);

        // Broadcast message via Supabase realtime
        const channel = supabase.channel(`chat-${conversationId}`);
        await channel.send({
          type: 'broadcast',
          event: 'new-message',
          payload: newMessage,
        });
      } catch (error) {
        console.error('Error sending message:', error);
        // Remove from local state if failed
        setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
      }
    },
    [userId, currentUser, conversationId],
  );

  // Join room
  const joinRoom = useCallback(async () => {
    if (!conversationId || !currentUser) return;

    const channel = supabase.channel(`chat-${conversationId}`);

    // Listen for all events
    channel
      // New message event
      .on(
        'broadcast',
        {event: 'new-message'},
        ({payload}: {payload: NewMessagePayload}) => {
          setMessages(prev => {
            if (prev.some(msg => msg.id === payload.id)) return prev;
            return [...prev, payload];
          });
        },
      )
      // User joined event
      .on(
        'broadcast',
        {event: 'user-joined'},
        ({payload}: {payload: UserJoinedPayload}) => {
          setOnlineUsers(prev => new Set([...prev, payload.userId]));
          console.log(`${payload.userName} joined the chat`);
        },
      )
      // User left event
      .on(
        'broadcast',
        {event: 'user-left'},
        ({payload}: {payload: UserLeftPayload}) => {
          setOnlineUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(payload.userId);
            return newSet;
          });
          console.log(`User ${payload.userId} left the chat`);
        },
      )
      .subscribe();

    // Send join event
    await channel.send({
      type: 'broadcast',
      event: 'user-joined',
      payload: {
        userId,
        userName: `${currentUser.name} ${currentUser.surname}`,
        timestamp: new Date().toISOString(),
      },
    });

    setIsConnected(true);

    return channel;
  }, [conversationId, userId, currentUser]);

  // Leave room
  const leaveRoom = useCallback(
    async (channel: ReturnType<typeof supabase.channel>) => {
      if (channel) {
        await channel.send({
          type: 'broadcast',
          event: 'user-left',
          payload: {
            userId,
            timestamp: new Date().toISOString(),
          },
        });
        await supabase.removeChannel(channel);
      }
      setIsConnected(false);
    },
    [userId],
  );

  // Initialize chat
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const initializeChat = async () => {
      await loadMessages();
      channel = (await joinRoom()) || null;
    };

    initializeChat();

    return () => {
      if (channel) {
        leaveRoom(channel);
      }
    };
  }, [loadMessages, joinRoom, leaveRoom]);

  return {
    messages,
    isConnected,
    isLoadingMessages,
    onlineUsers: Array.from(onlineUsers),
    sendMessage,
  };
};
