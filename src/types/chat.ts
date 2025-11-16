import {Database} from './supabase/database.types';

// Database types
export type Tables = Database['public']['Tables'];
export type MessagesTable = Tables['messages'];
export type ConversationsTable = Tables['conversations'];
export type UserProfilesTable = Tables['user_profiles'];

// Message types
export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  conversationId: string;
}

export interface MessageWithUser {
  id: string;
  message_text: string | null;
  sender_id: string | null;
  conversation_id: string | null;
  created_at: string;
  user_profiles: {
    name: string | null;
    surname: string | null;
  } | null;
}

// Supabase Realtime types
export interface SupabaseChannel {
  on: (
    _event: string,
    _filter: {event: string},
    _callback: (_payload: {payload: unknown}) => void,
  ) => SupabaseChannel;
  send: (_message: SupabaseBroadcastMessage) => Promise<{error: Error | null}>;
  subscribe: () => SupabaseChannel;
}

export interface SupabaseBroadcastMessage {
  type: 'broadcast';
  event: string;
  payload: unknown;
}

// Event payload types
export interface UserJoinedPayload {
  userId: string;
  userName: string;
  timestamp: string;
}

export interface UserLeftPayload {
  userId: string;
  timestamp: string;
}

export type NewMessagePayload = ChatMessage;

// Hook types
export interface UseSupabaseChatOptions {
  conversationId: string;
  skipInitialLoad?: boolean;
}

export interface UseSupabaseChatReturn {
  messages: ChatMessage[];
  isConnected: boolean;
  isLoadingMessages: boolean;
  onlineUsers: string[];
  sendMessage: (_text: string) => Promise<void>;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateConversationResponse {
  id: string;
  user_id: string | null;
  volunteer_id: string | null;
  name: string | null;
  created_at: string;
}

export interface CreateMessageRequest {
  conversationId: string;
  senderId: string;
  text: string;
}

export interface CreateConversationRequest {
  helpRequestId: string;
  volunteerId: string;
}

export interface ConversationWithUsers {
  id: string;
  user_id: string | null;
  volunteer_id: string | null;
  help_request_id: string | null;
  name: string | null;
  created_at: string;
  user_profiles: {
    name: string | null;
    surname: string | null;
  } | null;
  volunteer_profiles: {
    name: string | null;
    surname: string | null;
  } | null;
}
