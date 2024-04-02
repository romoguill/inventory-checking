'use client';

import Image from 'next/image';
import productPlaceholder from '../../../../../public/product-placeholder.png';
import { useEffect, useState } from 'react';
import { Product, User } from '@prisma/client';
import { tr } from 'date-fns/locale';
import { useProductsToBeInventoriedContext } from '@/app/context/ProductsToBeInventoriedContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getTeamByOrganization } from '@/actions/team';

function ProductsToBeInventoriedList() {
  const { products, dispatch } = useProductsToBeInventoriedContext();
  const [team, setTeam] = useState<
    Pick<User, 'id' | 'name' | 'email' | 'role' | 'image'>[] | null
  >(null);

  useEffect(() => {
    const getTeam = async () => {
      const response = await getTeamByOrganization();
      if (response.error) return;

      setTeam(response.data);
    };

    getTeam();
  }, []);

  return (
    <section>
      <table className='w-full border-separate border-spacing-y-4'>
        <thead>
          <tr className='text-left'>
            <th className='p-2 text-sm md:w-32 md:p-4'></th>
            <th className='p-2 text-sm md:text-base md:p-4'>Name</th>
            <th className='p-2 text-sm md:text-base md:p-4 text-center'>
              Current Stock
            </th>
            <th className='p-2 text-sm md:text-base md:p-4 text-center'>
              Last inventory
            </th>
            <th className='w-5'></th>
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
              <td>
                <Select>
                  <SelectTrigger className='bg-inherit border-2 border-dashboard-border focus-visible:ring-transparent focus-visible:ring-offset-0 ring-transparent placeholder:text-dashboard-foreground/80 w-[150px]'>
                    <SelectValue placeholder='Asign to...' />
                  </SelectTrigger>

                  <SelectContent className='bg-dashboard-dark text-dashboard-foreground'>
                    {team?.map((user) => (
                      <SelectItem
                        key={user.id}
                        value={user.id}
                        className='focus:bg-dashboard-accent'
                      >
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td>
                <DropdownMenu>
                  <DropdownMenuTrigger className='bg-dashboard-dark/50 p-1 rounded-md hover:bg-dashboard-dark'>
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    className='bg-dashboard-dark border-none'
                  >
                    <Button
                      variant='destructive'
                      className='w-full'
                      onClick={() =>
                        dispatch({
                          type: 'remove',
                          payload: product.id,
                        })
                      }
                    >
                      Remove
                    </Button>
                  </DropdownMenuContent>
                </DropdownMenu>
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
