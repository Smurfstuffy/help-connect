import HelpRequestCard from './HelpRequestCard';
import {HelpRequest} from '@/types/app/api';
import {FC, useEffect, useRef} from 'react';
import {FileText} from 'lucide-react';
import {useLanguage} from '@/contexts/LanguageContext';

interface HelpRequestListProps {
  helpRequests: HelpRequest[];
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

const HelpRequestList: FC<HelpRequestListProps> = ({
  helpRequests,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: HelpRequestListProps) => {
  const {t} = useLanguage();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasNextPage || !fetchNextPage || isFetchingNextPage) {
      return;
    }

    if (!loadMoreRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      {
        root: null, // Use viewport as root for page-level scrolling
        rootMargin: '200px', // Start loading 200px before reaching the bottom
      },
    );

    const currentRef = loadMoreRef.current;
    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">{t('list.loading')}</span>
      </div>
    );
  }

  if (!helpRequests || helpRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('list.noRequests')}
        </h3>
        <p className="text-gray-500">{t('list.beFirst')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {helpRequests?.map((helpRequest, index) => (
        <div
          key={helpRequest.id}
          className="animate-fade-in"
          style={{animationDelay: `${index * 0.1}s`}}
        >
          <HelpRequestCard helpRequest={helpRequest} />
        </div>
      ))}
      {/* Sentinel element for infinite scroll */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isFetchingNextPage && (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">
                {t('list.loadingMore')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HelpRequestList;
