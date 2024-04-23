'use client';

import { createReviewRound } from '@/actions/inventory';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface StartReviewRoundButtonProps {
  inventoryId: string;
  className?: string;
}

function StartReviewRoundButton({
  inventoryId,
  className,
}: StartReviewRoundButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const launchReview = async () => {
    setIsPending(true);

    const { data, error } = await createReviewRound(inventoryId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Review Round created successfully');
    }

    setIsPending(false);
  };
  return (
    <Button className={className} onClick={launchReview} disabled={isPending}>
      {isPending ? (
        <Loader2 className='animate-spin' />
      ) : (
        'Start Reconciliation'
      )}
    </Button>
  );
}

export default StartReviewRoundButton;
