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
  offset?: number;
  limit?: number;
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

    if (filters?.search && filters.search.trim()) {
      const searchTerm = filters.search.trim().toLowerCase();

      // Build OR conditions for text fields (can use ilike)
      const searchConditions = [
        `city.ilike.%${searchTerm}%`,
        `description.ilike.%${searchTerm}%`,
      ];

      // For enum fields, check if search term matches any enum value
      // This allows searching for "Food", "Medical", "High", etc.
      const categoryOptions = [
        'Food',
        'Transportation',
        'Medical',
        'Shelter',
        'Clothing',
        'Other',
      ];
      const urgencyOptions = ['Low', 'Medium', 'High', 'Critical'];

      const categoryMatch = categoryOptions.find(cat =>
        cat.toLowerCase().includes(searchTerm),
      );
      const urgencyMatch = urgencyOptions.find(urg =>
        urg.toLowerCase().includes(searchTerm),
      );

      // Add enum matches to search conditions
      if (categoryMatch) {
        searchConditions.push(`category.eq.${categoryMatch}`);
      }
      if (urgencyMatch) {
        searchConditions.push(`urgency.eq.${urgencyMatch}`);
      }

      // Apply all search conditions as OR
      query = query.or(searchConditions.join(','));
    }

    query = query.order('created_at', {ascending: true});

    if (filters?.offset !== undefined && filters?.limit !== undefined) {
      const from = filters.offset;
      const to = filters.offset + filters.limit - 1;
      query = query.range(from, to);
    }

    const {data, error} = await query;

    if (error) {
      console.error('Error fetching help requests:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching help requests:', error);
    throw error;
  }
}
