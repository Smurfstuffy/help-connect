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
import {useRouter} from 'next/navigation';
import {useChangeClosedStatusMutation} from '@/hooks/queries/help-requests/useChangeClosedStatusMutation';

const HelpRequestCard = ({helpRequest}: {helpRequest: HelpRequest}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {data: user} = useFetchUserQuery(helpRequest.user_id ?? '');
  const {userId} = useAuth();
  const {data: currentUser} = useFetchUserQuery(userId ?? '');
  const {mutate: toggleClosedStatus, isPending} =
    useChangeClosedStatusMutation();

  const isVolunteer = currentUser?.role === UserRole.VOLUNTEER;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-accent/90 transition-colors flex flex-row justify-between items-center">
          <CardHeader>
            <CardTitle>{helpRequest.city}</CardTitle>
            <CardDescription>{helpRequest.description}</CardDescription>
          </CardHeader>
          <div className="flex items-center mr-4">
            <HelpRequestStatus isClosed={helpRequest.is_closed ?? false} />
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Help Request Details</DialogTitle>
          <DialogDescription>{helpRequest.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-wrap gap-2">
            <h2>Request created by: </h2>
            <p>
              {user?.name} {user?.surname}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <h2>City: </h2>
            <p>{helpRequest.city}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <h2>Category: </h2>
            <p>{helpRequest.category}</p>
          </div>
        </div>
        <DialogFooter className="gap-2">
          {isVolunteer && (
            <Button
              type="button"
              className="cursor-pointer bg-yellow-600 hover:bg-yellow-700"
              onClick={() => {
                toggleClosedStatus(helpRequest.id);
                router.push('./chats');
                setOpen(false);
              }}
              disabled={isPending}
            >
              {isPending ? 'Updating...' : 'Close Request'}
            </Button>
          )}
          <Button
            type="submit"
            className="cursor-pointer"
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
