import {z} from 'zod';

export const UserRole = {
  USER: 'user',
  VOLUNTEER: 'volunteer',
} as const;

export const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  surname: z.string().min(2, 'Surname must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum([UserRole.USER, UserRole.VOLUNTEER]),
});
