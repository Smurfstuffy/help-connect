import {z} from 'zod';
import {UserRole} from './register';

export const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  surname: z.string().min(2, 'Surname must be at least 2 characters'),
  role: z.enum([UserRole.USER, UserRole.VOLUNTEER]),
});
