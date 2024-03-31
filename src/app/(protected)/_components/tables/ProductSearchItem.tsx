'use client';

import { CommandItem } from '@/components/ui/command';
import { Product } from '@prisma/client';
import Image from 'next/image';
import imageFallback from '../../../../../public/product-placeholder.png';
import { useProductsToBeInventoriedContext } from '@/app/context/ProductsToBeInventoriedContext';

interface ProductSearcItemProps {
  item: Product;
  onSelect: (value: string) => void;
}

function ProductSearchItem({ item, onSelect }: ProductSearcItemProps) {
  return (
    <CommandItem
      key={item.id}
      value={item.name}
      className='text-dashboard-foreground flex gap-3 py-2'
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
