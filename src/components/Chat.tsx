'use client';
import {useState, useRef, useEffect, useMemo} from 'react';
import {Button} from './ui/button';
import {Card, CardContent, CardHeader, CardTitle} from './ui/card';
import {ScrollArea} from './ui/scroll-area';
import {Textarea} from './ui/textarea';
import {useSupabaseChat} from '@/hooks/useSupabaseChat';
import {useAuth} from '@/hooks/useAuth';
import {useFetchMessagesInfiniteQuery} from '@/hooks/queries/messages/useFetchMessagesInfiniteQuery';
import {useFetchConversationByIdServiceQuery} from '@/hooks/queries/conversations/useFetchConversationByIdServiceQuery';
import {generateConversationSummary} from '@/services/axios/conversations/generateSummary';
import {translateMessage} from '@/services/axios/messages/translateMessage';
import {TranslationLanguage} from '@/services/openai/messages/translateMessage';
import {useLanguage} from '@/contexts/LanguageContext';
import {useFetchUserQuery} from '@/hooks/queries/user-profiles/useFetchUserQuery';
import {UserRole} from '@/types/app/register';
import {MessageCircle, User, AlertTriangle, Send, Sparkles} from 'lucide-react';
import {ChatMessage} from '@/types/chat';

interface ChatProps {
  conversationId?: string;
}

const Chat = ({conversationId = 'default-room'}: ChatProps) => {
  const {userId} = useAuth();
  const {language: appLanguage, t} = useLanguage();
  const {data: currentUser} = useFetchUserQuery(userId ?? '');
  const {data: conversation} =
    useFetchConversationByIdServiceQuery(conversationId);
  const [message, setMessage] = useState('');
  const [summaryMessage, setSummaryMessage] = useState<ChatMessage | null>(
    null,
  );
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  // Map of messageId -> translatedText (only stores when translated)
  const [translations, setTranslations] = useState<Record<string, string>>({});
  // Map of messageId -> boolean (is translating)
  const [translatingMessages, setTranslatingMessages] = useState<
    Record<string, boolean>
  >({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef(true);
  const previousScrollHeightRef = useRef(0);

  // Fetch messages with infinite query
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useFetchMessagesInfiniteQuery(conversationId);

  // Flatten pages into single array and reverse to show oldest first (newest at bottom)
  const fetchedMessages = useMemo(() => {
    if (!messagesData?.pages) return [];
    // Messages come in DESC order (newest first) per page
    // Reverse each page individually, then combine to maintain chronological order
    const reversedPages = messagesData.pages
      .map(page => {
        const validPage = (page ?? []).filter(
          (item): item is NonNullable<typeof item> => item !== undefined,
        );
        // Reverse each page to get oldest first within the page
        return [...validPage].reverse();
      })
      .reverse(); // Reverse the order of pages (newest page first becomes oldest page first)

    // Flatten all pages
    return reversedPages.flat();
  }, [messagesData]);

  const {
    messages: realtimeMessages,
    isConnected,
    sendMessage: sendChatMessage,
  } = useSupabaseChat({conversationId, skipInitialLoad: true});

  // Transform fetched messages to ChatMessage format
  const transformedFetchedMessages = useMemo<ChatMessage[]>(() => {
    return fetchedMessages.map(msg => ({
      id: msg.id,
      text: msg.message_text || '',
      senderId: msg.sender_id || '',
      senderName:
        `${msg.user_profiles?.name || ''} ${msg.user_profiles?.surname || ''}`.trim(),
      timestamp: msg.created_at,
      conversationId: msg.conversation_id || '',
    }));
  }, [fetchedMessages]);

  // Merge fetched messages with realtime messages (avoid duplicates)
  const allMessages = useMemo(() => {
    const messageMap = new Map<string, ChatMessage>();

    // Add fetched messages first
    transformedFetchedMessages.forEach(msg => {
      messageMap.set(msg.id, msg);
    });

    // Add realtime messages (newer ones will overwrite if duplicate)
    realtimeMessages.forEach(msg => {
      messageMap.set(msg.id, msg);
    });

    // Sort by timestamp ascending (oldest first)
    const sortedMessages = Array.from(messageMap.values()).sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    // Add summary message at the end if it exists
    if (summaryMessage) {
      sortedMessages.push(summaryMessage);
    }

    return sortedMessages;
  }, [transformedFetchedMessages, realtimeMessages, summaryMessage]);

  // Get display text for a message (original or translated)
  const getMessageText = (messageId: string, originalText: string): string => {
    const translation = translations[messageId];
    return translation || originalText;
  };

  // Check if message is translated
  const isMessageTranslated = (messageId: string): boolean => {
    return !!translations[messageId];
  };

  // Scroll to bottom on initial load
  useEffect(() => {
    if (
      isInitialLoadRef.current &&
      !isLoadingMessages &&
      allMessages.length > 0
    ) {
      setTimeout(() => {
        if (scrollAreaRef.current) {
          const scrollElement = scrollAreaRef.current.querySelector(
            '[data-slot="scroll-area-viewport"]',
          );
          if (scrollElement) {
            scrollElement.scrollTop = scrollElement.scrollHeight;
            isInitialLoadRef.current = false;
          }
        }
      }, 100);
    }
  }, [isLoadingMessages, allMessages.length]);

  // Auto-scroll to bottom when new messages arrive (but not when loading older messages)
  useEffect(() => {
    if (
      !isInitialLoadRef.current &&
      !isFetchingNextPage &&
      scrollAreaRef.current
    ) {
      const scrollElement = scrollAreaRef.current.querySelector(
        '[data-slot="scroll-area-viewport"]',
      );
      if (scrollElement) {
        // Only auto-scroll if user is near the bottom (within 100px)
        const isNearBottom =
          scrollElement.scrollHeight -
            scrollElement.scrollTop -
            scrollElement.clientHeight <
          100;
        if (isNearBottom) {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }
      }
    }
  }, [realtimeMessages.length, isFetchingNextPage]);

  // Maintain scroll position when loading older messages
  useEffect(() => {
    if (isFetchingNextPage && messagesContainerRef.current) {
      const scrollElement = scrollAreaRef.current?.querySelector(
        '[data-radix-scroll-area-viewport]',
      );
      if (scrollElement) {
        previousScrollHeightRef.current = scrollElement.scrollHeight;
      }
    }
  }, [isFetchingNextPage]);

  useEffect(() => {
    if (
      !isFetchingNextPage &&
      previousScrollHeightRef.current > 0 &&
      messagesContainerRef.current
    ) {
      const scrollElement = scrollAreaRef.current?.querySelector(
        '[data-radix-scroll-area-viewport]',
      );
      if (scrollElement) {
        const newScrollHeight = scrollElement.scrollHeight;
        const scrollDifference =
          newScrollHeight - previousScrollHeightRef.current;
        scrollElement.scrollTop += scrollDifference;
        previousScrollHeightRef.current = 0;
      }
    }
  }, [isFetchingNextPage, allMessages.length]);

  // Intersection Observer for infinite scroll (load older messages when scrolling up)
  useEffect(() => {
    if (!hasNextPage || !fetchNextPage || isFetchingNextPage) {
      return;
    }

    const scrollElement = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]',
    );

    if (!scrollElement || !loadMoreRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      {
        root: scrollElement,
        rootMargin: '200px', // Start loading 200px before reaching the top
      },
    );

    const currentLoadMoreRef = loadMoreRef.current;
    observer.observe(currentLoadMoreRef);

    return () => {
      observer.unobserve(currentLoadMoreRef);
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

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

  const handleGenerateSummary = async () => {
    if (!conversationId || isGeneratingSummary || allMessages.length === 0) {
      return;
    }

    setIsGeneratingSummary(true);
    try {
      const summary = await generateConversationSummary({
        conversationId,
      });

      // Create optimistic summary message (always on left side, not from current user)
      const summaryChatMessage: ChatMessage = {
        id: `summary-${Date.now()}`,
        text: summary,
        senderId: 'ai-summary', // Special ID to identify it's not from a real user
        senderName: 'AI Summary',
        timestamp: new Date().toISOString(),
        conversationId,
      };

      setSummaryMessage(summaryChatMessage);

      // Auto-scroll to show the summary
      setTimeout(() => {
        if (scrollAreaRef.current) {
          const scrollElement = scrollAreaRef.current.querySelector(
            '[data-radix-scroll-area-viewport]',
          );
          if (scrollElement) {
            scrollElement.scrollTop = scrollElement.scrollHeight;
          }
        }
      }, 100);
    } catch (error) {
      console.error('Error generating summary:', error);
      // You could add a toast notification here
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleTranslateMessage = async (
    messageId: string,
    originalText: string,
  ) => {
    // If already translated, remove translation (show original)
    if (translations[messageId]) {
      setTranslations(prev => {
        const newTranslations = {...prev};
        delete newTranslations[messageId];
        return newTranslations;
      });
      return;
    }

    // Determine target language based on app language
    // If app is Ukrainian, translate to Ukrainian; if English, translate to English
    const targetLanguage: TranslationLanguage =
      appLanguage === 'ua' ? 'ukrainian' : 'english';

    setTranslatingMessages(prev => ({...prev, [messageId]: true}));

    try {
      const translatedText = await translateMessage({
        text: originalText,
        targetLanguage,
      });

      // Optimistically update the translation
      setTranslations(prev => ({
        ...prev,
        [messageId]: translatedText,
      }));
    } catch (error) {
      console.error('Error translating message:', error);
      // You could add a toast notification here
    } finally {
      setTranslatingMessages(prev => {
        const newTranslating = {...prev};
        delete newTranslating[messageId];
        return newTranslating;
      });
    }
  };

  // Get conversation title or fallback
  const conversationTitle = conversation?.name
    ? conversation.name
    : conversation && currentUser
      ? (() => {
          const otherParticipant =
            currentUser.role === UserRole.VOLUNTEER
              ? conversation.user_profiles
              : conversation.volunteer_profiles;
          const otherParticipantName = otherParticipant
            ? `${otherParticipant.name || ''} ${otherParticipant.surname || ''}`.trim()
            : t('conversations.unknownUser');
          return `${t('conversations.chatWith')} ${otherParticipantName}`;
        })()
      : t('chat.title');

  return (
    <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm rounded-2xl h-full flex flex-col">
      <CardHeader className="justify-center flex-shrink-0">
        <CardTitle className="flex items-center justify-center">
          <span className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            {conversationTitle}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0 p-0">
        <div className="flex-1 min-h-0 px-8">
          <ScrollArea
            ref={scrollAreaRef}
            className="h-full bg-gray-100 rounded-lg"
          >
            <div className="p-4">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">
                    {t('chat.loadingMessages')}
                  </span>
                </div>
              ) : allMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('chat.noMessages')}
                  </h3>
                  <p className="text-gray-500">{t('chat.startConversation')}</p>
                </div>
              ) : (
                <div ref={messagesContainerRef}>
                  {/* Sentinel element for infinite scroll at the top */}
                  {hasNextPage && (
                    <div ref={loadMoreRef} className="flex justify-center py-4">
                      {isFetchingNextPage && (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span className="ml-2 text-sm text-gray-600">
                            {t('chat.loadingOlder')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {allMessages.map((msg, i) => {
                    const isSummary = msg.senderId === 'ai-summary';
                    const isFromCurrentUser = msg.senderId === userId;
                    const displayText = getMessageText(msg.id, msg.text);
                    const isTranslating = translatingMessages[msg.id];
                    const isTranslated = isMessageTranslated(msg.id);

                    return (
                      <div
                        key={msg.id || i}
                        className={`mb-4 ${isFromCurrentUser ? 'text-right' : 'text-left'}`}
                      >
                        <div
                          className={`text-xs text-gray-500 mb-1 flex items-center gap-1 ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          {isSummary ? (
                            <Sparkles className="w-3 h-3" />
                          ) : (
                            <User className="w-3 h-3" />
                          )}
                          {msg.senderName} •{' '}
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                        <div
                          className={`inline-block px-4 py-3 rounded-2xl max-w-xs shadow-sm ${
                            isFromCurrentUser
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                              : isSummary
                                ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-gray-800 border-2 border-amber-200'
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}
                        >
                          {displayText}
                        </div>
                        {/* Translation link for messages from other users */}
                        {!isFromCurrentUser && !isSummary && (
                          <div>
                            {isTranslating ? (
                              <span className="text-xs text-gray-400">
                                {t('chat.translating')}...
                              </span>
                            ) : (
                              <button
                                onClick={() =>
                                  handleTranslateMessage(msg.id, msg.text)
                                }
                                className="text-xs text-gray-500 hover:text-gray-700 underline cursor-pointer transition-colors"
                              >
                                {isTranslated
                                  ? t('chat.showOriginal')
                                  : t('chat.translate')}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="px-8 pb-4 pt-4 space-y-3 flex-shrink-0">
          <div className="flex gap-2">
            <Button
              className="flex-1 cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGenerateSummary}
              disabled={
                isGeneratingSummary || !isConnected || allMessages.length === 0
              }
            >
              {isGeneratingSummary ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t('chat.generating')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {t('chat.generateSummary')}
                </span>
              )}
            </Button>
          </div>
          <Textarea
            placeholder={t('chat.writeMessage')}
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
                {t('chat.disconnected')}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                {t('chat.sendMessage')}
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chat;
