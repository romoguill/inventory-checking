'use server';

import { getServerAuthSession } from '@/auth/auth.config';
import { db } from '@/lib/db';
import { getWorkingOrganization } from './organization';
import { getProductState } from '@/lib/utils';

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

export const getRoundSummary = async (roundId: string) => {
  const response = await db.inventoryRound.findUnique({
    where: {
      id: roundId,
    },
    select: {
      inventory: {
        include: {
          products: {
            select: {
              initalStock: true,
            },
          },
        },
      },
      round_product_user: {
        select: {
          currentStock: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              policy: {
                select: {
                  threshold: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const parsedResponse = {
    inventoryId: response?.inventory.id,
    roundItem:
      response?.round_product_user.map((item, i) => ({
        user: { ...item.user },
        product: {
          id: item.product.id,
          name: item.product.name,
          threshold: item.product.policy.threshold,
          initialStock: response.inventory.products[i].initalStock,
          roundStock: item.currentStock,
        },
        get status() {
          return getProductState(
            this.product.initialStock,
            this.product.roundStock,
            this.product.threshold
          );
        },
      })) || [],
  };

  return parsedResponse;
};

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

export const createReviewRound = async (inventoryId: string) => {
  const { data: currentOrganization } = await getWorkingOrganization();

  if (!currentOrganization) {
    return { data: null, error: { message: 'Unauthorized' } };
  }

  const existingInventory = await db.inventory.findUnique({
    where: {
      id: inventoryId,
    },
  });

  if (!existingInventory) {
    return {
      data: null,
      error: { message: 'No inventory with that ID exists' },
    };
  }

  const existingRounds = await db.inventoryRound.findMany({
    where: {
      inventoryId,
    },
  });

  // Check if inventory has original round created and also check if review round exists
  if (!existingRounds.find((round) => round.name === 'ORIGINAL')) {
    return {
      data: null,
      error: {
        message:
          "Can't create a review round for an inventory that has no original round created",
      },
    };
  }

  if (existingRounds.find((round) => round.name === 'REVIEW')) {
    return {
      data: null,
      error: { message: 'Inventory has already an active review round' },
    };
  }

  const roundSummary = await getRoundSummary(
    existingRounds.find((round) => round.name === 'ORIGINAL')?.id || ''
  );
  console.log(JSON.stringify(roundSummary, undefined, 2));

  // const response = await db.inventoryRound.create({
  //   data: {
  //     name: 'REVIEW',
  //     round_product_user: {
  //       create: {
  //         product: {
  //           connect: {

  //           }
  //         }
  //       }
  //     }
  //   }
  // })

  // const response = await db.inventory.create({
  //   data: {
  //     finished: false,
  //     organizationId: currentOrganization.id,
  //     products: {
  //       create: inventoryItem.map((item, i) => ({
  //         product: {
  //           connect: {
  //             id: item.productId,
  //           },
  //         },
  //         initalStock: currentStocks[i].currentStock,
  //         reconciledStock: 0,
  //       })),
  //     },
  //     round: {
  //       create: {
  //         name: 'ORIGINAL',
  //         round_product_user: {
  //           create: inventoryItem.map((item) => ({
  //             product: {
  //               connect: {
  //                 id: item.productId,
  //               },
  //             },
  //             user: {
  //               connect: {
  //                 id: item.userId,
  //               },
  //             },
  //           })),
  //         },
  //       },
  //     },
  //   },
  // });

  // return { data: response, error: null };
};

// If user is specified, get only inventories with that user participating in at least 1 round.
// TODO: Works but difficult to read. Maybe create 3 queries for the 3 different filters
export const getOngoingInventories = async (
  userId?: string,
  filter: 'all' | 'ongoing' | 'finished' = 'all'
) => {
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
                AND: {
                  userId,
                  OR: [
                    {
                      currentStock: {
                        equals: filter === 'ongoing' ? null : undefined,
                      },
                    },
                    {
                      currentStock: {
                        not: filter === 'finished' ? null : undefined,
                      },
                    },
                  ],
                },
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
