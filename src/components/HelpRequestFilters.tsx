'use client';

import {useState} from 'react';
import {Input} from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {Button} from './ui/button';
import {Search, X, Filter} from 'lucide-react';
import {CATEGORY_OPTIONS, URGENCY_OPTIONS} from '@/types/app/enums';
import {HelpRequestFilters} from '@/services/supabase/help-request/fetch';

interface HelpRequestFiltersProps {
  filters: HelpRequestFilters;
  onFiltersChange: (_filters: HelpRequestFilters) => void;
}

const HelpRequestFiltersComponent = ({
  filters,
  onFiltersChange,
}: HelpRequestFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (
    key: keyof HelpRequestFilters,
    value: string | boolean | undefined,
  ) => {
    onFiltersChange({...filters, [key]: value});
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="space-y-4 mb-4 px-4">
      {/* Search Bar - Always Visible */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by city, category, urgency, or description..."
          value={filters.search || ''}
          onChange={e => updateFilter('search', e.target.value || undefined)}
          className="pl-12 w-full"
        />
      </div>

      {/* Expandable Filters */}
      <div className="border rounded-lg p-4 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Filter className="w-4 h-4" />
            {isExpanded ? 'Hide Filters' : 'Show Filters'}
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                {Object.keys(filters).filter(k => k !== 'search').length}
              </span>
            )}
          </button>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-gray-600 hover:text-gray-900"
            >
              <X className="w-3 h-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <Select
                value={filters.category}
                onValueChange={value =>
                  updateFilter('category', value || undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Urgency Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Urgency
              </label>
              <Select
                value={filters.urgency}
                onValueChange={value =>
                  updateFilter('urgency', value || undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Urgency Levels" />
                </SelectTrigger>
                <SelectContent>
                  {URGENCY_OPTIONS.map(urgency => (
                    <SelectItem key={urgency} value={urgency}>
                      {urgency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <Select
                value={
                  filters.is_closed === undefined
                    ? undefined
                    : filters.is_closed
                      ? 'closed'
                      : 'open'
                }
                onValueChange={value => {
                  updateFilter('is_closed', value === 'closed');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* City Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">City</label>
              <Input
                type="text"
                placeholder="Filter by city..."
                value={filters.city || ''}
                onChange={e =>
                  updateFilter('city', e.target.value || undefined)
                }
              />
            </div>

            {/* Date Range Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                From Date
              </label>
              <Input
                type="date"
                value={filters.minDate || ''}
                onChange={e =>
                  updateFilter('minDate', e.target.value || undefined)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                To Date
              </label>
              <Input
                type="date"
                value={filters.maxDate || ''}
                onChange={e =>
                  updateFilter('maxDate', e.target.value || undefined)
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpRequestFiltersComponent;
