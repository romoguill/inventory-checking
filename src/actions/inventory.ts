'use server';

import { Presets } from '@/app/(protected)/_components/CreateNewInventory';
import { Product } from '@prisma/client';
import { getWorkingOrganization } from './organization';
import { db } from '@/lib/db';
import { getServerAuthSession } from '@/auth/auth.config';

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
      include: {
        round: true,
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
      include: {
        round: true,
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

export const getInventoryRoundDetails = async (
  inventoryId: string,
  userId?: string
) => {
  // If inventory has a review round, it must be in that stage. Else return the original
  const response = await db.inventoryRound.findMany({
    where: {
      inventoryId,
    },
    include: {
      round_product_user: {
        where: {
          userId: userId ? userId : {},
        },
        include: {
          product: true,
        },
      },
    },
  });

  if (response.find((round) => round.name === 'REVIEW')) {
    return {
      data: response.filter((round) => round.name === 'REVIEW')[0],
      error: null,
    };
  } else {
    return { data: response[0], error: null };
  }
};

export const updateUserCheckingRound = async (
  roundId: string,
  data: { productId: string; stock: number }[]
) => {
  const session = await getServerAuthSession();

  if (!session) {
    return { data: null, error: { message: 'Not authenticated' } };
  }
  const round = await db.inventoryRound.findUnique({
    where: {
      id: roundId,
    },
  });

  if (!round) {
    return { data: null, error: { message: 'No round found with that ID' } };
  }

  try {
    await db.$transaction(
      async (tx) => {
        for (const item of data) {
          await tx.inventoryRoundProductUser.update({
            where: {
              inventoryRoundId_userId_productId: {
                inventoryRoundId: roundId,
                productId: item.productId,
                userId: session.user.id,
              },
            },
            data: {
              currentStock: item.stock,
            },
          });
        }
      },
      {
        maxWait: 5000,
        timeout: 10000,
        isolationLevel: 'Serializable',
      }
    );
    return { data: 'Round confirmed', error: null };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error: { message: 'Error in the update transaction' },
    };
  }
};
