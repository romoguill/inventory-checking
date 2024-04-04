'use client';

import {
  InventoryState,
  useProductsToBeInventoriedContext,
} from '@/app/context/ProductsToBeInventoriedContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// If at least one item doesn't have a user selected, use this to prevent creating inventory
const allUsersAssigned = (inventoryItems: InventoryState) => {
  return inventoryItems.every(({ user }) => Boolean(user));
};

function ConfirmInventoryButton() {
  const { inventoryItems } = useProductsToBeInventoriedContext();

  if (!inventoryItems.length) return;

  const handleCreateInventory = () => {
    if (allUsersAssigned(inventoryItems)) {
      console.log('passed');
    } else {
      toast.error("Some products don't have a user assinged");
    }
  };

  return (
    <Button variant='submit' onClick={handleCreateInventory}>
      Confirm inventory
    </Button>
  );
}

export default ConfirmInventoryButton;
