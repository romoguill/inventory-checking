import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import LoginForm from './LoginForm';
import ProviderButton from './ProviderButton';
import { PROVIDERS } from '@/schemas/auth.schemas';
import { Separator } from '@/components/ui/separator';

interface AuthCardProps {
  action: 'login' | 'register';
}

function AuthCard({ action }: AuthCardProps) {
  return (
    <Card className='w-full min-w-[300px] sm:min-w-[450px] max-w-[500px]'>
      <CardHeader>
        {action === 'login' ? 'Sign in' : 'Sign up'}

        <CardDescription>Welcome back</CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm />

        <div className='relative my-8 text-center'>
          <Separator />
          <span className='absolute -top-0 left-[50%] -translate-y-1/2 -translate-x-1/2 p-2 bg-background text-sm text-muted-foreground'>
            or
          </span>
        </div>

        <ProviderButton provider={PROVIDERS.GOOGLE} className='w-full' />
      </CardContent>
    </Card>
  );
}

export default AuthCard;
