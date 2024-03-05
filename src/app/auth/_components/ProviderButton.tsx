'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PROVIDERS } from '@/schemas/auth.schemas';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

interface ProviderButtonProps {
  provider: PROVIDERS;
  className?: string;
}

const providersData = {
  [PROVIDERS.GOOGLE]: {
    src: '/providers-google.png',
    alt: 'Google Provider',
  },
};

function ProviderButton({ provider, className }: ProviderButtonProps) {
  return (
    <Button
      variant='secondary'
      className={cn('gap-2', className)}
      type='button'
      onClick={() => signIn(provider)}
    >
      <Image
        src={providersData[provider].src}
        alt={providersData[provider].alt}
        width={22}
        height={22}
      />
      <p>
        Sign up with <span className='capitalize'>{provider}</span>
      </p>
    </Button>
  );
}

export default ProviderButton;
