import {z} from 'zod';
import {CATEGORY_OPTIONS, URGENCY_OPTIONS} from '@/types/app/enums';

export const requestSchema = z.object({
  city: z.string().min(1, 'City is required'),
  category: z.enum(CATEGORY_OPTIONS as [string, ...string[]], {
    required_error: 'Category is required',
  }),
  urgency: z.enum(URGENCY_OPTIONS as [string, ...string[]], {
    required_error: 'Urgency is required',
  }),
  description: z.string().min(1, 'Description is required'),
});

export type RequestFormValues = z.infer<typeof requestSchema>;
