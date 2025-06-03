import {useMutation} from '@tanstack/react-query';
import {createConversation} from '@/services/axios/conversations/createConversation';
import {ConversationInsert} from '@/services/supabase/conversations/create';

export const useCreateConversationMutation = () => {
  return useMutation({
    mutationFn: (conversation: ConversationInsert) =>
      createConversation(conversation),
  });
};
