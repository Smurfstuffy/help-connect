'use client';

import {useState, useEffect} from 'react';
import {Button} from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {UserRole} from '@/types/app/register';
import {useDeleteHelpRequestMutation} from '@/hooks/queries/help-requests/useDeleteHelpRequestMutation';
import {useChangeClosedStatusMutation} from '@/hooks/queries/help-requests/useChangeClosedStatusMutation';
import {useAuth} from '@/hooks/useAuth';
import {useLanguage} from '@/contexts/LanguageContext';
import {AlertTriangle, Trash2} from 'lucide-react';
import axios from 'axios';
import {ApiResponse} from '@/types/app/api';
import {HelpRequest} from '@/services/supabase/help-request/fetch';

interface PostChatDeletionDialogProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  helpRequestId: string | null;
  userRole: string;
}

const PostChatDeletionDialog = ({
  open,
  onOpenChange,
  helpRequestId,
  userRole,
}: PostChatDeletionDialogProps) => {
  const {userId} = useAuth();
  const {t} = useLanguage();
  const {mutate: deleteHelpRequest, isPending: isDeleting} =
    useDeleteHelpRequestMutation();
  const {mutate: toggleClosedStatus, isPending: isClosing} =
    useChangeClosedStatusMutation();
  const [helpRequest, setHelpRequest] = useState<HelpRequest | null>(null);

  useEffect(() => {
    if (open && helpRequestId) {
      axios
        .get<ApiResponse<HelpRequest[]>>('/api/help-requests/get')
        .then(response => {
          const request = response.data.data?.find(
            req => req.id === helpRequestId,
          );
          setHelpRequest(request || null);
        })
        .catch(error => {
          console.error('Error fetching help request:', error);
        });
    } else {
      setHelpRequest(null);
    }
  }, [open, helpRequestId]);

  const isUser = userRole === UserRole.USER;
  const isVolunteer = userRole === UserRole.VOLUNTEER;
  const isRequestClosed = helpRequest?.is_closed === true;
  const shouldShowDialog = isUser || (isVolunteer && !isRequestClosed);

  if (!shouldShowDialog) {
    return null;
  }

  if (isVolunteer && !helpRequestId) {
    return null;
  }

  if (isUser && !helpRequestId) {
    return null;
  }

  const handleDeleteRequest = () => {
    if (isUser && helpRequestId) {
      deleteHelpRequest({id: helpRequestId, userId: userId!});
      onOpenChange(false);
    }
  };

  const handleCloseRequest = () => {
    if (isVolunteer && !isRequestClosed && helpRequestId) {
      toggleClosedStatus(helpRequestId);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open && shouldShowDialog} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            {isUser
              ? t('dialog.deleteRequestTitle')
              : t('dialog.closeRequestTitle')}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isUser
              ? t('dialog.deleteRequestDescription')
              : t('dialog.closeRequestDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600">
            {isUser
              ? t('dialog.deleteRequestMessage')
              : t('dialog.closeRequestMessage')}
          </p>
        </div>
        <DialogFooter className="gap-2">
          {isUser && (
            <Button
              type="button"
              className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border-0"
              onClick={handleDeleteRequest}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? t('dialog.deleting') : t('dialog.deleteRequest')}
            </Button>
          )}
          {isVolunteer && !isRequestClosed && (
            <Button
              type="button"
              className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border-0"
              onClick={handleCloseRequest}
              disabled={isClosing}
            >
              {isClosing ? t('dialog.closing') : t('dialog.closeRequest')}
            </Button>
          )}
          <Button
            type="button"
            className="cursor-pointer bg-gray-500 hover:bg-gray-600 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl border-0"
            onClick={() => onOpenChange(false)}
          >
            {t('card.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostChatDeletionDialog;
