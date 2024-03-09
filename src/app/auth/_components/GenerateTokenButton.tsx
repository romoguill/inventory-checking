'use client';

import { generateEmailVerification } from '@/actions/email-verification';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface GenerateTokenButtonProps {
  email: string;
  name: string | null;
}

function GenerateTokenButton({ email, name }: GenerateTokenButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const onClick = async () => {
    setIsPending(true);
    await generateEmailVerification(email, name);
    setIsPending(false);
  };

  return (
    <Button onClick={onClick} disabled={isPending}>
      {!isPending ? 'Generate token' : <Loader2 className='animate-spin' />}
    </Button>
  );
}

export default GenerateTokenButton;
