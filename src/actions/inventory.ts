'use server';

import { Presets } from '@/app/(protected)/_components/CreateNewInventory';
import { Product } from '@prisma/client';
import { getWorkingOrganization } from './organization';
import { db } from '@/lib/db';

interface InventoryItem {
  productId: string;
  userId: string;
}

export const createInventory = async (inventoryItem: InventoryItem[]) => {
  const { data: currentOrganization } = await getWorkingOrganization();

  if (!currentOrganization) {
    return { data: null, error: { message: 'Unauthorized' } };
  }

  const currentStocks = await db.product.findMany({
    where: {
      id: {
        in: inventoryItem.map((item) => item.productId),
      },
    },
    select: {
      currentStock: true,
    },
  });

  const response = await db.inventory.create({
    data: {
      finished: false,
      organizationId: currentOrganization.id,
      products: {
        create: inventoryItem.map((item, i) => ({
          product: {
            connect: {
              id: item.productId,
            },
          },
          initalStock: currentStocks[i].currentStock,
          reconciledStock: 0,
        })),
      },
      round: {
        create: {
          name: 'ORIGINAL',
          round_product_user: {
            create: inventoryItem.map((item) => ({
              product: {
                connect: {
                  id: item.productId,
                },
              },
              user: {
                connect: {
                  id: item.userId,
                },
              },
            })),
          },
        },
      },
    },
  });

  return { data: response, error: null };
};

export const getOngoingInventories = async () => {
  const { data: currentOrganization } = await getWorkingOrganization();

  if (!currentOrganization) {
    return { data: null, error: { message: 'Unauthorized' } };
  }

  const response = await db.inventory.findMany({
    where: {
      finished: false,
    },
  });

  return { data: response, error: null };
};

export const getInventoryDetailById = async (id: string) => {
  const response = await db.inventory.findUnique({
    where: {
      id,
    },
    include: {
      products: true,
      round: {
        include: {
          round_product_user: true,
        },
      },
    },
  });

  return { data: response, error: null };
};
