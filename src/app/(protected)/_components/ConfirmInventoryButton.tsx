'use client';

import { createInventory } from '@/actions/inventory';
import {
  InventoryState,
  useProductsToBeInventoriedContext,
} from '@/app/context/ProductsToBeInventoriedContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

// If at least one item doesn't have a user selected, use this to prevent creating inventory
const allUsersAssigned = (inventoryItems: InventoryState) => {
  return inventoryItems.every(({ user }) => Boolean(user));
};

function ConfirmInventoryButton() {
  const { inventoryItems } = useProductsToBeInventoriedContext();
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  if (!inventoryItems.length) return;

  const handleCreateInventory = async () => {
    if (allUsersAssigned(inventoryItems)) {
      setIsCreating(true);
      const response = await createInventory(
        inventoryItems.map((item) => ({
          productId: item.product.id,
          userId: item.user!.id,
        }))
      );

      if (response.error) {
        toast.error('There was a problem. Please try later');
      } else {
        toast.success('Inventory created');
        router.push('/dashboard');
      }
      setIsCreating(false);
    } else {
      toast.error("Some products don't have a user assinged");
    }
  };

  return (
    <Button
      variant='submit'
      onClick={handleCreateInventory}
      disabled={isCreating}
      className='w-36'
    >
      {isCreating ? <Loader2 className='animate-spin' /> : 'Confirm inventory'}
    </Button>
  );
}

export default ConfirmInventoryButton;
