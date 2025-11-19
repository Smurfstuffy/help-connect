'use client';
import {useState, useRef, useEffect} from 'react';
import {Button} from './ui/button';
import {CardContent, CardHeader, CardTitle} from './ui/card';
import {ScrollArea} from './ui/scroll-area';
import {Textarea} from './ui/textarea';
import {useAuth} from '@/hooks/useAuth';
import {useFetchUserQuery} from '@/hooks/queries/user-profiles/useFetchUserQuery';
import {useLanguage} from '@/contexts/LanguageContext';
import {getChatbotResponse} from '@/services/axios/chatbot/chatbot';
import {ChatbotMessage} from '@/services/openai/chatbot/chatbot';
import {MessageCircle, Send, X, Bot} from 'lucide-react';

interface ChatbotProps {
  className?: string;
}

const Chatbot = ({className}: ChatbotProps) => {
  const {userId} = useAuth();
  const {language: appLanguage, t} = useLanguage();
  const {data: user} = useFetchUserQuery(userId ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
      setTimeout(() => {
        const scrollElement = scrollAreaRef.current?.querySelector(
          '[data-slot="scroll-area-viewport"]',
        );
        if (scrollElement) {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }
      }, 100);
    }
  }, [messages, isOpen, isLoading]);

  // Initialize with welcome message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatbotMessage = {
        role: 'assistant',
        content: t('chatbot.welcome'),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, t]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatbotMessage = {
      role: 'user',
      content: inputMessage.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await getChatbotResponse({
        messages: newMessages,
        userContext: {
          name: user?.name ?? undefined,
          surname: user?.surname ?? undefined,
          role: user?.role ?? undefined,
          language: appLanguage === 'ua' ? 'Ukrainian' : 'English',
        },
      });

      const assistantMessage: ChatbotMessage = {
        role: 'assistant',
        content: response,
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      const errorMessage: ChatbotMessage = {
        role: 'assistant',
        content: t('chatbot.error'),
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Optionally clear messages when closing
    // setMessages([]);
  };

  if (!user) {
    return null;
  }

  return (
    <div className={className}>
      {/* Fixed Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center cursor-pointer group"
          aria-label={t('chatbot.open')}
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <CardTitle className="text-lg font-semibold text-white">
                  {t('chatbot.title')}
                </CardTitle>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 transition-colors p-1 rounded-md hover:bg-white/20 cursor-pointer"
                aria-label={t('chatbot.close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 p-4 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 min-h-0 overflow-hidden">
              <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="space-y-4 pr-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg px-4 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 mt-4 flex items-center gap-2">
              <Textarea
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('chatbot.placeholder')}
                className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 h-auto cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
