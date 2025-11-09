'use server';

import {Tables} from '@/types/supabase/database.types';
import {supabaseAdmin} from '../supabaseAdmin';

export type HelpRequest = Tables<'help_requests'>;

export interface HelpRequestFilters {
  userId?: string;
  category?: string;
  urgency?: string;
  is_closed?: boolean;
  city?: string;
  search?: string;
  minDate?: string;
  maxDate?: string;
}

export async function getHelpRequest(
  filters?: HelpRequestFilters,
): Promise<HelpRequest[] | null> {
  try {
    let query = supabaseAdmin.from('help_requests').select('*');

    // Apply filters
    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.urgency) {
      query = query.eq('urgency', filters.urgency);
    }

    if (filters?.is_closed !== undefined) {
      query = query.eq('is_closed', filters.is_closed);
    }

    if (filters?.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    if (filters?.minDate) {
      query = query.gte('created_at', filters.minDate);
    }

    if (filters?.maxDate) {
      query = query.lte('created_at', filters.maxDate);
    }

    const {data, error} = await query.order('created_at', {ascending: true});

    if (error) {
      console.error('Error fetching help requests:', error);
      throw new Error(error.message);
    }

    // Apply search filter in memory (searches across multiple fields)
    let filteredData = data || [];
    if (filters?.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filteredData = filteredData.filter(request => {
        const city = request.city?.toLowerCase() || '';
        const category = request.category?.toLowerCase() || '';
        const urgency = request.urgency?.toLowerCase() || '';
        const description = request.description?.toLowerCase() || '';

        return (
          city.includes(searchTerm) ||
          category.includes(searchTerm) ||
          urgency.includes(searchTerm) ||
          description.includes(searchTerm)
        );
      });
    }

    return filteredData;
  } catch (error) {
    console.error('Unexpected error fetching help requests:', error);
    throw error;
  }
}
