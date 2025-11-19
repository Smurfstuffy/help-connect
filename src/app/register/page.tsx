'use client';
import Link from 'next/link';
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
import {supabase} from '@/lib/supabase';
import {useRouter} from 'next/navigation';
import {useLanguage} from '@/contexts/LanguageContext';
import {formSchema, UserRole} from '../../types/app/register';
import {useCreateUserMutation} from '@/hooks/queries/user-profiles/useCreateUserMutation';

export default function RegisterPage() {
  const router = useRouter();
  const {t} = useLanguage();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      role: UserRole.USER,
    },
  });

  const createUserMutation = useCreateUserMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const {data, error} = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${
            process.env.NEXT_PUBLIC_APP_URL || window.location.origin
          }/auth/callback`,
        },
      });

      if (error) {
        form.setError('root', {
          message: error.message,
        });
        return;
      }

      if (data.user) {
        // Create user profile using mutation
        await createUserMutation.mutateAsync({
          id: data.user.id,
          name: values.name,
          surname: values.surname,
          role: values.role,
        });
      }

      router.push('/confirm');
    } catch {
      form.setError('root', {
        message: t('register.unexpectedError'),
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-normal pb-1">
              {t('register.title')}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 leading-relaxed">
              {t('register.subtitle')}{' '}
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors leading-normal"
              >
                {t('register.signIn')}
              </Link>
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{t('register.name')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('register.namePlaceholder')}
                        {...field}
                      />
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
                    <FormLabel>{t('register.surname')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('register.surnamePlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{t('register.email')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('register.emailPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{t('register.password')}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t('register.passwordPlaceholder')}
                        {...field}
                      />
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
                    <FormLabel>{t('register.role')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t('register.rolePlaceholder')}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.USER}>
                          {t('register.user')}
                        </SelectItem>
                        <SelectItem value={UserRole.VOLUNTEER}>
                          {t('register.volunteer')}
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
                className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? t('register.creatingAccount')
                  : t('register.createAccount')}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
