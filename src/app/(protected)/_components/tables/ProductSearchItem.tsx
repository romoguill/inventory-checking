import { CommandItem } from '@/components/ui/command';
import { Product } from '@prisma/client';
import Image from 'next/image';
import imageFallback from '../../../../../public/product-placeholder.png';

interface ProductSearcItemProps {
  item: Product;
}

function ProductSearchItem({ item }: ProductSearcItemProps) {
  return (
    <CommandItem
      key={item.id}
      value={item.name}
      className='text-dashboard-foreground flex gap-3 py-2'
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
