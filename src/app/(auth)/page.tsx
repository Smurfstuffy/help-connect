import HelpRequestList from '@/components/HelpRequestList';
import RequestDialog from '@/components/RequestDialog';

export default function Home() {
  return (
    <div className="h-full flex flex-col gap-4 py-4 justify-center items-center">
      <RequestDialog />
      <HelpRequestList />
    </div>
  );
}
