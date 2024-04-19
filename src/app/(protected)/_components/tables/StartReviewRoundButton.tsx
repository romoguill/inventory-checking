'use client';

import { createReviewRound } from '@/actions/inventory';
import { Button } from '@/components/ui/button';

interface StartReviewRoundButtonProps {
  className?: string;
}

function StartReviewRoundButton({ className }: StartReviewRoundButtonProps) {
  const launchReview = async () => {
    await createReviewRound('clul48ufs0011qeyoiza9cka5');
  };
  return (
    <Button className={className} onClick={launchReview}>
      Launch Review
    </Button>
  );
}

export default StartReviewRoundButton;
