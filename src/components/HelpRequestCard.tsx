import {HelpRequest} from '@/services/supabase/help-request/fetch';
import {Card, CardDescription, CardHeader, CardTitle} from './ui/card';
import {useRouter} from 'next/navigation';

const HelpRequestCard = ({helpRequest}: {helpRequest: HelpRequest}) => {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer hover:bg-accent/90 transition-colors"
      onClick={() => router.push(`/help-request/${helpRequest.id}`)}
    >
      <CardHeader>
        <CardTitle>Help Request</CardTitle>
        <CardDescription>{helpRequest.description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default HelpRequestCard;
