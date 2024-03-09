'use client';

import { DEFAULT_REDIRECT } from '@/auth/routes';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoginSchema } from '@/schemas/auth.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { SignInResponse, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

function LoginForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    setIsPending(true);

    const { error, ok } = (await signIn('credentials', {
      redirect: false,
      ...data,
    })) as SignInResponse;

    if (error) {
      if (error === 'CredentialsSignin') {
        form.setError('root', {
          type: 'credentials',
          message: 'Invalid credentials',
        });
        toast.error('Invalid credentials');
      } else {
        toast.error('Something went wrong. Please try again later');
      }

      setIsPending(false);
      return;
    }

    setIsPending(false);
    router.push('/dashboard');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-3'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='user@email.com' {...field} type='email' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder='******' {...field} type='password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type='submit' className='mt-6 w-full' disabled={isPending}>
          {!isPending ? 'Sign in' : <Loader2 className='animate-spin' />}
        </Button>

        {form.formState.errors.root && (
          <p className='text-sm font-medium text-destructive mt-2'>
            {form.formState.errors.root.message}
          </p>
        )}
      </form>
    </Form>
  );
}

export default LoginForm;
