'use client';

import { CommandItem } from '@/components/ui/command';
import { Product } from '@prisma/client';
import Image from 'next/image';
import imageFallback from '../../../../../public/product-placeholder.png';
import {
  InventoryState,
  useProductsToBeInventoriedContext,
} from '@/app/context/ProductsToBeInventoriedContext';
import { cn } from '@/lib/utils';

const isItemInList = (item: Product, list: InventoryState) => {
  return list.find(({ product }) => item.id === product.id) ? true : false;
};

interface ProductSearcItemProps {
  item: Product;
  onSelect: (value: string) => void;
}

function ProductSearchItem({ item, onSelect }: ProductSearcItemProps) {
  const { inventoryItems } = useProductsToBeInventoriedContext();

  return (
    <CommandItem
      key={item.id}
      value={item.name}
      className={cn('text-dashboard-foreground flex gap-3 py-2 my-3', {
        'aria-selected:bg-green-500/30 bg-green-400/20': isItemInList(
          item,
          inventoryItems
        ),
      })}
      onSelect={() => {
        console.log('run');
        onSelect('hola');
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Image
        src={item.imageUrl || imageFallback}
        alt={`Product ${item.name}`}
        width={80}
        height={80}
        className='object-cover w-[80px] h-[80px] rounded-md'
      />
      <h5 className='text-lg'>{item.name}</h5>
    </CommandItem>
  );
}

export default ProductSearchItem;
