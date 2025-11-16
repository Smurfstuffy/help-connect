import axios from 'axios';
import {ApiResponse, HelpRequest} from '@/types/app/api';
import {HelpRequestFilters} from '@/services/supabase/help-request/fetch';

export const fetchHelpRequests = async (
  filters?: HelpRequestFilters,
): Promise<HelpRequest[] | undefined> => {
  const params = new URLSearchParams();

  if (filters?.userId) {
    params.append('userId', filters.userId);
  }
  if (filters?.category) {
    params.append('category', filters.category);
  }
  if (filters?.urgency) {
    params.append('urgency', filters.urgency);
  }
  if (filters?.is_closed !== undefined) {
    params.append('is_closed', filters.is_closed.toString());
  }
  if (filters?.city) {
    params.append('city', filters.city);
  }
  if (filters?.search) {
    params.append('search', filters.search);
  }
  if (filters?.minDate) {
    params.append('minDate', filters.minDate);
  }
  if (filters?.maxDate) {
    params.append('maxDate', filters.maxDate);
  }
  if (filters?.offset !== undefined) {
    params.append('offset', filters.offset.toString());
  }
  if (filters?.limit !== undefined) {
    params.append('limit', filters.limit.toString());
  }

  const queryString = params.toString();
  const url = `/api/help-requests/get${queryString ? `?${queryString}` : ''}`;

  const {data} = await axios.get<ApiResponse<HelpRequest[]>>(url);
  return data?.data;
};
