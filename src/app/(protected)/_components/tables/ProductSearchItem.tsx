import { CommandItem } from '@/components/ui/command';
import { Product } from '@prisma/client';
import Image from 'next/image';
import imageFallback from '../../../../../public/product-placeholder.png';

interface ProductSearcItemProps {
  item: Product;
}

function ProductSearchItem({ item }: ProductSearcItemProps) {
  return (
    <CommandItem key={item.id} value={item.name}>
      <Image
        src={item.imageUrl || imageFallback}
        alt={`Product ${item.name}`}
        width={80}
        height={80}
      />
      {item.name}
    </CommandItem>
  );
}

export default ProductSearchItem;
