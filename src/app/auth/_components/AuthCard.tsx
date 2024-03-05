import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PROVIDERS } from '@/schemas/auth.schemas';
import Link from 'next/link';
import LoginForm from './LoginForm';
import ProviderButton from './ProviderButton';
import RegisterForm from './RegisterForm';

interface AuthCardProps {
  action: 'login' | 'register';
}

function AuthCard({ action }: AuthCardProps) {
  return (
    <Card className='w-full min-w-[300px] sm:min-w-[450px] max-w-[500px]'>
      <CardHeader>
        <h1 className='text-3xl font-bold tracking-wide leading-loose'>
          {action === 'login' ? 'Sign in' : 'Sign up'}
        </h1>

        <CardDescription>
          {action === 'login'
            ? 'Welcome back'
            : 'Hi! Please create your account to continue'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {action === 'login' ? <LoginForm /> : <RegisterForm />}

        {action === 'login' && (
          <p className='text-sm mt-2'>
            Don&apos;t have an account?
            <span className='ml-1'>
              <Link
                href='/auth/register'
                className='text-blue-700 font-semibold hover:text-blue-500'
              >
                Sign up
              </Link>
            </span>
          </p>
        )}

        {action === 'register' && (
          <p className='text-sm mt-2'>
            Already have an account?
            <span className='ml-1'>
              <Link
                href='/auth/login'
                className='text-blue-700 font-semibold hover:text-blue-500'
              >
                Sign in
              </Link>
            </span>
          </p>
        )}

        <div className='relative my-8 text-center'>
          <Separator />
          <span className='absolute -top-0 left-[50%] -translate-y-1/2 -translate-x-1/2 p-2 bg-background text-sm text-muted-foreground'>
            or
          </span>
        </div>

        <ProviderButton
          action={action}
          provider={PROVIDERS.GOOGLE}
          className='w-full'
        />
      </CardContent>
    </Card>
  );
}

export default AuthCard;
