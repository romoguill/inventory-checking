'use client';

import Image from 'next/image';
import productPlaceholder from '../../../../../public/product-placeholder.png';
import { useState } from 'react';
import { Product } from '@prisma/client';
import { tr } from 'date-fns/locale';
import { useProductsToBeInventoriedContext } from '@/app/context/ProductsToBeInventoriedContext';

function ProductsToBeInventoriedList() {
  const { products } = useProductsToBeInventoriedContext();

  console.log(products);
  return (
    <section>
      <table className='w-full border-separate border-spacing-y-4'>
        <thead>
          <tr className='text-left'>
            <th className='p-2 text-sm md:w-32 md:p-4'></th>
            <th className='p-2 text-sm md:p-4'>Name</th>
            <th className='p-2 text-sm md:p-4 text-center'>Current Stock</th>
            <th className='p-2 text-sm md:p-4 text-center'>Last inventory</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <Image
                  src={product.imageUrl || productPlaceholder}
                  alt={`Product ${product.name}`}
                  width={128}
                  height={128}
                  className='w-20 md:w-32 aspect-square rounded-md min-w-24'
                />
              </td>
              <td className='p-2 md:p-4 text-sm md:text-lg font-bold'>
                {product.name}
              </td>
              <td className='p-2 md:p-4 text-sm md:text-base text-center'>
                {product.currentStock}
              </td>
              {/* TODO: Get last inventory of product */}
              <td className='p-2 md:p-4 text-sm md:text-base text-center'>
                2024/02/04
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className='text-center text-dashboard-foreground/80 text-sm mt-3'>
          No products added yet.
        </div>
      )}
    </section>
  );
}

export default ProductsToBeInventoriedList;
