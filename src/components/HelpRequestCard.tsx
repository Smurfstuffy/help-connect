'use client';
import {HelpRequest} from '@/services/supabase/help-request/fetch';
import {Card, CardDescription, CardHeader, CardTitle} from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {Button} from './ui/button';
import {useState} from 'react';
import {useFetchUserQuery} from '@/hooks/queries/user-profiles/useFetchUserQuery';
import HelpRequestStatus from './HelpRequestStatus';
import {useAuth} from '@/hooks/useAuth';
import {UserRole} from '@/types/app/register';
import {useChangeClosedStatusMutation} from '@/hooks/queries/help-requests/useChangeClosedStatusMutation';
import {useCreateConversationFromRequestMutation} from '@/hooks/queries/conversations/useCreateConversationFromRequestMutation';
import {useDeleteHelpRequestMutation} from '@/hooks/queries/help-requests/useDeleteHelpRequestMutation';
import {useLanguage} from '@/contexts/LanguageContext';
import {MapPin, Clipboard, User, Tag, Trash2, AlertCircle} from 'lucide-react';

const HelpRequestCard = ({helpRequest}: {helpRequest: HelpRequest}) => {
  const {t} = useLanguage();
  const [open, setOpen] = useState(false);
  const {data: user} = useFetchUserQuery(helpRequest.user_id ?? '');
  const {userId} = useAuth();
  const {data: currentUser} = useFetchUserQuery(userId ?? '');
  const {mutate: toggleClosedStatus, isPending} =
    useChangeClosedStatusMutation();
  const {mutate: createConversation, isPending: isCreatingConversation} =
    useCreateConversationFromRequestMutation();
  const {mutate: deleteHelpRequest, isPending: isDeleting} =
    useDeleteHelpRequestMutation();

  const isVolunteer = currentUser?.role === UserRole.VOLUNTEER;
  const isUser = currentUser?.role === UserRole.USER;
  const isOwner = helpRequest.user_id === userId;
  const canDelete = isUser && isOwner;
  const isClosed = helpRequest.is_closed ?? false;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in flex flex-row justify-between items-center">
          <CardHeader className="flex-1 min-w-0">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              {helpRequest.city}
            </CardTitle>
            <CardDescription className="text-gray-600 line-clamp-2">
              {helpRequest.description}
            </CardDescription>
          </CardHeader>
          <div className="flex items-center mr-4 flex-shrink-0">
            <HelpRequestStatus isClosed={helpRequest.is_closed ?? false} />
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clipboard className="w-6 h-6" />
            {t('card.details')}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {helpRequest.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-wrap gap-2 items-center">
            <User className="w-6 h-6" />
            <h2 className="font-medium">{t('card.createdBy')}</h2>
            <p className="text-gray-600">
              {user?.name} {user?.surname}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <MapPin className="w-6 h-6" />
            <h2 className="font-medium">{t('card.city')}</h2>
            <p className="text-gray-600">{helpRequest.city}</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Tag className="w-6 h-6" />
            <h2 className="font-medium">{t('card.category')}</h2>
            <p className="text-gray-600">{helpRequest.category}</p>
          </div>
          {helpRequest.urgency && (
            <div className="flex flex-wrap gap-2 items-center">
              <AlertCircle className="w-6 h-6" />
              <h2 className="font-medium">{t('card.urgency')}</h2>
              <p className="text-gray-600">{helpRequest.urgency}</p>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          {isVolunteer && (
            <>
              <Button
                type="button"
                className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => {
                  createConversation({
                    helpRequestId: helpRequest.id,
                    volunteerId: userId!,
                  });
                  setOpen(false);
                }}
                disabled={isCreatingConversation}
              >
                {isCreatingConversation
                  ? t('card.creating')
                  : t('card.directMessage')}
              </Button>
              <Button
                type="button"
                className={`cursor-pointer text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                  isClosed
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                onClick={() => {
                  toggleClosedStatus(helpRequest.id);
                  setOpen(false);
                }}
                disabled={isPending}
              >
                {isPending
                  ? t('card.updating')
                  : isClosed
                    ? t('card.activateRequest')
                    : t('card.closeRequest')}
              </Button>
            </>
          )}
          {canDelete && (
            <Button
              type="button"
              className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border-0"
              onClick={() => {
                deleteHelpRequest({id: helpRequest.id, userId: userId!});
                setOpen(false);
              }}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? t('card.deleting') : t('card.delete')}
            </Button>
          )}
          <Button
            type="submit"
            className="cursor-pointer bg-gray-500 hover:bg-gray-600 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            onClick={() => setOpen(false)}
          >
            {t('card.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HelpRequestCard;
