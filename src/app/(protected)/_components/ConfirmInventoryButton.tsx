'use client';

import { useProductsToBeInventoriedContext } from '@/app/context/ProductsToBeInventoriedContext';
import { Button } from '@/components/ui/button';

function ConfirmInventoryButton() {
  const { products } = useProductsToBeInventoriedContext();

  if (!products.length) return;

  return <Button variant='submit'>Confirm inventory</Button>;
}

export default ConfirmInventoryButton;
