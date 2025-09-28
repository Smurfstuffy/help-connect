import {useMutation} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {
  CreateConversationRequest,
  ApiResponse,
  CreateConversationResponse,
} from '@/types/chat';

const createConversationFromRequest = async ({
  helpRequestId,
  volunteerId,
}: CreateConversationRequest): Promise<
  ApiResponse<CreateConversationResponse>
> => {
  const response = await fetch('/api/conversations/create-from-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      helpRequestId,
      volunteerId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create conversation');
  }

  return response.json();
};

export const useCreateConversationFromRequestMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: createConversationFromRequest,
    onSuccess: data => {
      if (data.success && data.data) {
        // Navigate to the chat with the conversation ID
        router.push(`/chats/${data.data.id}`);
      }
    },
    onError: error => {
      console.error('Error creating conversation:', error);
    },
  });
};
