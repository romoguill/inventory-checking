'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PROVIDERS } from '@/schemas/auth.schemas';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import GoogleLogo from './provider-google.svg';
import GithubLogo from './provider-github.svg';

interface ProviderButtonProps {
  provider: PROVIDERS;
  action: 'login' | 'register';
  className?: string;
}

const providersData = {
  [PROVIDERS.GOOGLE]: {
    src: GoogleLogo,
    alt: 'Google Provider',
  },
  [PROVIDERS.GITHUB]: {
    src: GithubLogo,
    alt: 'GitHub Provider',
  },
};

function ProviderButton({ provider, className, action }: ProviderButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const providerLogin = async () => {
    setIsPending(true);

    const response = await signIn(provider, { callbackUrl: '/dashboard' });

    if (response?.error) {
      toast.error('Ups! There was a problem, try later');
    }

    setIsPending(false);
  };

  return (
    <Button
      variant='secondary'
      className={cn('gap-2', className)}
      type='button'
      onClick={providerLogin}
      disabled={isPending}
    >
      <Image
        src={providersData[provider].src}
        alt={providersData[provider].alt}
        width={22}
        height={22}
      />
      <p>
        <span>{action === 'login' ? 'Sign in ' : 'Sign up'}</span> with{' '}
        <span className='capitalize'>{provider}</span>
      </p>
    </Button>
  );
}

export default ProviderButton;
