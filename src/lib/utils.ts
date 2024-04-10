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
