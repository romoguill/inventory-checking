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

// If user is specified, get only inventories with that user participating in at least 1 round.
export const getOngoingInventories = async (userId?: string) => {
  const { data: currentOrganization } = await getWorkingOrganization();

  if (!currentOrganization) {
    return { data: null, error: { message: 'Unauthorized' } };
  }

  if (!userId) {
    const response = await db.inventory.findMany({
      where: {
        finished: false,
      },
    });

    return { data: response, error: null };
  } else {
    const response = await db.inventory.findMany({
      where: {
        finished: false,
        round: {
          some: {
            round_product_user: {
              some: {
                userId,
              },
            },
          },
        },
      },
    });
    return { data: response, error: null };
  }
};

export const getInventoryDetailById = async (id: string) => {
  const response = await db.inventory.findUnique({
    where: {
      id,
    },
    include: {
      products: {
        include: {
          product: true,
        },
      },
      round: {
        include: {
          round_product_user: {
            include: {
              product: true,
              user: true,
            },
          },
        },
      },
    },
  });

  return { data: response, error: null };
};

// To check if the round is finished, for now only check if some item still has current inventory = null.
export const isRoundFinished = async (roundId: string) => {
  const response = await db.inventoryRound.findFirst({
    where: {
      id: roundId,
    },
    include: {
      round_product_user: {
        where: {
          currentStock: {
            not: null,
          },
        },
      },
    },
  });

  return Boolean(response);
};
