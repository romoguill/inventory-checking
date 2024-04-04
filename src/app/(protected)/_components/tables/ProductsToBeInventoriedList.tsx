'use client';

import Image from 'next/image';
import productPlaceholder from '../../../../../public/product-placeholder.png';
import { useEffect, useState } from 'react';
import { Product, User } from '@prisma/client';
import { tr } from 'date-fns/locale';
import {
  InventoryState,
  useProductsToBeInventoriedContext,
} from '@/app/context/ProductsToBeInventoriedContext';
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
  const { inventoryItems, dispatch } = useProductsToBeInventoriedContext();
  const [team, setTeam] = useState<InventoryState[number]['user'][] | null>(
    null
  );

  useEffect(() => {
    const getTeam = async () => {
      const response = await getTeamByOrganization();
      if (response.error) return;

      setTeam(response.data);
    };

    getTeam();
  }, []);

  const handleUserChange = (userId: string, productId: string) => {
    const user = team?.find((user) => user?.id === userId);
    if (!user) return;

    dispatch({
      type: 'updateUser',
      payload: {
        productId,
        user,
      },
    });
  };

  console.log(inventoryItems);

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
          {inventoryItems.map((item) => (
            <tr key={item.product.id}>
              <td>
                <Image
                  src={item.product.imageUrl || productPlaceholder}
                  alt={`Product ${item.product.name}`}
                  width={128}
                  height={128}
                  className='w-20 md:w-32 aspect-square rounded-md min-w-24'
                />
              </td>
              <td className='p-2 md:p-4 text-sm md:text-lg font-bold'>
                {item.product.name}
              </td>
              <td className='p-2 md:p-4 text-sm md:text-base text-center'>
                {item.product.currentStock}
              </td>
              {/* TODO: Get last inventory of product */}
              <td className='p-2 md:p-4 text-sm md:text-base text-center'>
                2024/02/04
              </td>
              <td>
                <Select
                  onValueChange={(userId) =>
                    handleUserChange(userId, item.product.id)
                  }
                >
                  <SelectTrigger className='bg-inherit border-2 border-dashboard-border focus-visible:ring-transparent focus-visible:ring-offset-0 ring-transparent placeholder:text-dashboard-foreground/80 w-[150px]'>
                    <SelectValue placeholder='Assign to...' />
                  </SelectTrigger>

                  <SelectContent className='bg-dashboard-dark text-dashboard-foreground'>
                    {team?.map((user) => (
                      <SelectItem
                        key={user?.id}
                        value={user?.id || ''}
                        className='focus:bg-dashboard-accent'
                      >
                        {user?.name}
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
                          payload: item.product.id,
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
      {inventoryItems.length === 0 && (
        <div className='text-center text-dashboard-foreground/80 text-sm mt-3'>
          No products added yet.
        </div>
      )}
    </section>
  );
}

export default ProductsToBeInventoriedList;
