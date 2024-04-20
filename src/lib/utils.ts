import { getOngoingInventories } from '@/actions/inventory';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Current inventory round will be determined by exitance of name: "Round", meaning org user has created a new
export const getCurrentInventoryRound = (
  inventoryId: string,
  inventories: Awaited<ReturnType<typeof getOngoingInventories>>['data']
) => {
  const roundInReview = inventories
    ?.find((inv) => inv.id === inventoryId)
    ?.round.some((r) => r.name === 'REVIEW');

  return roundInReview ? 'REVIEW' : 'ORIGINAL';
};

export type ProductCheckingState =
  | {
      status: 'ok';
      delta: null;
    }
  | {
      status: 'passed';
      delta: number;
    }
  | { status: 'rejected'; delta: number };

export const getProductState = (
  initialStock: number | undefined,
  roundStock: number | undefined | null,
  threshold: number | undefined | null
): ProductCheckingState | null => {
  if (!initialStock || !roundStock || !threshold) {
    return null;
  }
  if (initialStock === roundStock) {
    return {
      status: 'ok',
      delta: null,
    };
  } else if (Math.abs(initialStock - roundStock) <= initialStock * threshold) {
    console.log({
      diff: initialStock - roundStock,
      permitted: initialStock * threshold,
    });
    return {
      status: 'passed',
      delta: roundStock - initialStock,
    };
  } else {
    return {
      status: 'rejected',
      delta: roundStock - initialStock,
    };
  }
};
