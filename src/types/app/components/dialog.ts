import {z} from 'zod';

export const requestSchema = z.object({
  city: z.string().min(1, 'City is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
});

export type RequestFormValues = z.infer<typeof requestSchema>;
