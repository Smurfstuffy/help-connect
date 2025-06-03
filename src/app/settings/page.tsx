'use client';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {formSchema} from '../../types/app/settings';
import {UserRole} from '../../types/app/register';
import {useFetchUserQuery} from '@/hooks/queries/user-profiles/useFetchUserQuery';
import {useAuth} from '@/hooks/useAuth';
import {useEditUserMutation} from '@/hooks/queries/user-profiles/useEditUserMutation';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

export default function SettingsPage() {
  const router = useRouter();
  const {userId} = useAuth();
  const {data: user, isLoading} = useFetchUserQuery(userId ?? '');
  const editUserMutation = useEditUserMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      surname: '',
      role: UserRole.USER,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        surname: user.surname || '',
        role: user.role as (typeof UserRole)[keyof typeof UserRole],
      });
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userId) return;

    try {
      const result = await editUserMutation.mutateAsync({
        userId,
        user: values,
      });

      if (result) {
        router.push('/');
      }
    } catch {
      form.setError('root', {
        message: 'Failed to update profile',
      });
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Settings
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Update your profile information
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Surname</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your surname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.USER}>User</SelectItem>
                      <SelectItem value={UserRole.VOLUNTEER}>
                        Volunteer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <p className="text-sm text-red-500">
                {form.formState.errors.root.message}
              </p>
            )}
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={editUserMutation.isPending}
            >
              {editUserMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
