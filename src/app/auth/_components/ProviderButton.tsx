'use client';

import { Button } from '@/components/ui/button';
import { PROVIDERS } from '@/schemas/auth.schemas';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

interface ProviderButtonProps {
  provider: PROVIDERS;
}

const providersData = {
  [PROVIDERS.GOOGLE]: {
    src: '/providers-google.png',
    alt: 'Google Provider',
  },
};

function ProviderButton({ provider }: ProviderButtonProps) {
  return (
    <Button
      variant='secondary'
      className='gap-2'
      type='button'
      onClick={() => signIn(provider)}
    >
      <Image
        src={providersData[provider].src}
        alt={providersData[provider].alt}
        width={24}
        height={24}
      />
      <p>Sign Up with Google</p>
    </Button>
  );
}

export default ProviderButton;
