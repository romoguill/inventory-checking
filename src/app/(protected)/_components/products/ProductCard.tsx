import { cn } from '@/lib/utils';
import { Prisma, Product, Severity } from '@prisma/client';
import Image from 'next/image';
import fallback from '../../../../../public/product-placeholder.png';

interface ProductCardProps {
  product: Prisma.ProductGetPayload<{ include: { policy: true } }>;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <>
      <td className='relative bg-dashboard-foreground/10 px-1 rounded-l-lg'>
        <Image
          src={product.imageUrl || fallback}
          alt={`Product ${product.name}`}
          fill
          className='overflow-hidden rounded-md'
        />
      </td>

      <td className='bg-dashboard-foreground/10 px-1 font-bold'>
        {product.name}
      </td>

      <td className='bg-dashboard-foreground/10 px-1'>
        {product.currentStock}
      </td>
      <td className='bg-dashboard-foreground/10 px-1 rounded-r-xl md:rounded-none'>
        {product.batchTracking ? 'Yes' : 'No'}
      </td>
      <td
        className={cn(
          'bg-dashboard-foreground/10 px-1 rounded-r-lg capitalize hidden md:table-cell',
          {
            'text-green-500': product.policy.name === Severity.LOW,
            'text-orange-500': product.policy.name === Severity.MEDIUM,
            'text-red-500': product.policy.name === Severity.HIGH,
          }
        )}
      >
        {product.policy.name.toLowerCase()}
      </td>
    </>
  );
}

export default ProductCard;
