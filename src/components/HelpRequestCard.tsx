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

const HelpRequestCard = ({helpRequest}: {helpRequest: HelpRequest}) => {
  const [open, setOpen] = useState(false);
  const {data: user} = useFetchUserQuery(helpRequest.user_id ?? '');
  const {userId} = useAuth();
  const {data: currentUser} = useFetchUserQuery(userId ?? '');
  const {mutate: toggleClosedStatus, isPending} =
    useChangeClosedStatusMutation();
  const {mutate: createConversation, isPending: isCreatingConversation} =
    useCreateConversationFromRequestMutation();

  const isVolunteer = currentUser?.role === UserRole.VOLUNTEER;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fade-in flex flex-row justify-between items-center">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              {helpRequest.city}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {helpRequest.description}
            </CardDescription>
          </CardHeader>
          <div className="flex items-center mr-4">
            <HelpRequestStatus isClosed={helpRequest.is_closed ?? false} />
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Help Request Details
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {helpRequest.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-2xl">👤</span>
            <h2 className="font-medium">Request created by:</h2>
            <p className="text-gray-600">
              {user?.name} {user?.surname}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-2xl">📍</span>
            <h2 className="font-medium">City:</h2>
            <p className="text-gray-600">{helpRequest.city}</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-2xl">🏷️</span>
            <h2 className="font-medium">Category:</h2>
            <p className="text-gray-600">{helpRequest.category}</p>
          </div>
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
                {isCreatingConversation ? 'Creating...' : 'Direct Message'}
              </Button>
              <Button
                type="button"
                className="cursor-pointer bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => {
                  toggleClosedStatus(helpRequest.id);
                  setOpen(false);
                }}
                disabled={isPending}
              >
                {isPending ? 'Updating...' : 'Close Request'}
              </Button>
            </>
          )}
          <Button
            type="submit"
            className="cursor-pointer bg-gray-500 hover:bg-gray-600 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HelpRequestCard;
