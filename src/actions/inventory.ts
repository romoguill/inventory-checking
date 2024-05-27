'use server';

import { getServerAuthSession } from '@/auth/auth.config';
import { db } from '@/lib/db';
import { getWorkingOrganization } from './organization';
import { getProductState } from '@/lib/utils';

// To check if the round is finished, for now only check if some item still has current inventory = null.
export const isRoundFinished = async (roundId: string) => {
  const response = await db.inventoryRound.findUnique({
    where: {
      id: roundId,
      round_product_user: {
        every: {
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

  if (!response) {
    return null;
  }

  const parsedResponse = {
    inventoryId: response.inventory.id,
    roundItem:
      response.round_product_user.map((item, i) => ({
        user: { ...item.user },
        product: {
          id: item.product.id,
          name: item.product.name,
          threshold: item.product.policy.threshold,
          initialStock: response.inventory.products[i].initalStock,
          roundStock: item.currentStock,
        },
        get roundState() {
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

  if (!roundSummary) {
    return {
      data: null,
      error: {
        message: 'There was an error calculating the previous round summary',
      },
    };
  }

  try {
    const response = await db.inventoryRound.create({
      data: {
        name: 'REVIEW',
        inventoryId: roundSummary.inventoryId || '',
        round_product_user: {
          create: roundSummary.roundItem
            .filter((item) => item.roundState?.status === 'rejected')
            .map((itemFiltered) => ({
              product: {
                connect: {
                  id: itemFiltered.product.id,
                },
              },
              user: {
                connect: {
                  id: itemFiltered.user.id,
                },
              },
            })),
        },
      },
    });

    return { data: response, error: null };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error: { message: 'There was a problem creating the review round' },
    };
  }
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

export const getInventoryRoundDetails = async (id: string, userId?: string) => {
  // If inventory has a review round, it must be in that stage. Else return the original
  const response = await db.inventoryRound.findMany({
    where: {
      id,
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

export const getRounds = async (
  userId?: string,
  state: 'all' | 'ongoing' | 'finished' = 'all'
) => {
  const rounds = await db.inventoryRound.findMany({
    where: {
      round_product_user: {
        some: {
          userId: userId || undefined,
        },
      },
    },
  });

  if (state === 'all') {
    return { data: rounds, error: null };
  } else {
    const boolArray = await Promise.all(
      rounds.map((round) => {
        return isRoundFinished(round.id);
      })
    );

    return {
      data: rounds.filter((_, i) =>
        state === 'ongoing' ? !boolArray[i] : boolArray[i]
      ),
      error: null,
    };
  }
};

export const getRoundsFromInventory = async (inventoryId: string) => {
  const response = await db.inventory.findUnique({
    where: {
      id: inventoryId,
    },
    select: {
      round: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return { data: response ? [...response.round] : [], error: null };
};

type RejectedProduct = {
  productId: string;
  method: 'ORIGINAL' | 'REVIEW' | 'AVERAGE';
};

type ReconciliationResponse = {
  productId: string;
  reconciledStock: number;
}[];

export const inventoryReconciliation = async (
  inventoryId: string,
  rejectedProducts: RejectedProduct[]
) => {
  const inventory = await db.inventory.findUnique({
    where: { id: inventoryId },
  });

  if (!inventory) {
    return { data: null, error: { message: 'Inventory not found' } };
  }

  // Just to be certain check first if the inventory has all rounds complete
  const { data: rounds } = await getRoundsFromInventory(inventoryId);

  const areAllRoundsFinished = (
    await Promise.all(rounds.map((round) => isRoundFinished(round.id)))
  ).every(Boolean);

  if (!areAllRoundsFinished) {
    return {
      data: null,
      error: { message: 'Inventory has rounds still unfinished.' },
    };
  }

  const roundsDetail = await db.inventoryRound.findMany({
    where: {
      id: {
        in: rounds.map((round) => round.id),
      },
    },
    select: {
      name: true,
      round_product_user: {
        select: {
          productId: true,
          currentStock: true,
        },
      },
    },
  });

  // Start reconciliation calculation
  // Util func to get the method of reconciling rejected products and returing the final stock, either the original stock, review stock or an average between those
  function getReconciledStockForRejectedProducts(
    rejectedProducts: RejectedProduct[],
    rounds: typeof roundsDetail
  ): ReconciliationResponse {
    return rejectedProducts.map((rejectedProduct) => {
      const originalStock = rounds.find(
        (round) =>
          round.name === 'ORIGINAL' &&
          round.round_product_user.find(
            (rpu) => rpu.productId === rejectedProduct.productId
          )
      )?.round_product_user[0].currentStock;

      const reviewStock = rounds.find(
        (round) =>
          round.name === 'REVIEW' &&
          round.round_product_user.find(
            (rpu) => rpu.productId === rejectedProduct.productId
          )
      )?.round_product_user[0].currentStock;

      // This SHOULD NEVER HAPPEN. Just in case and to please TS
      if (!originalStock || !reviewStock) {
        throw new Error(
          "Confirmed stocks for this products are null. Can't proceed with reconciliation"
        );
      }

      if (rejectedProduct.method === 'ORIGINAL')
        return {
          productId: rejectedProduct.productId,
          reconciledStock: originalStock,
        };

      if (rejectedProduct.method === 'REVIEW')
        return {
          productId: rejectedProduct.productId,
          reconciledStock: reviewStock,
        };

      return {
        productId: rejectedProduct.productId,
        reconciledStock: (originalStock + reviewStock) / 2,
      };
    });
  }

  const reconciliation: ReconciliationResponse =
    getReconciledStockForRejectedProducts(rejectedProducts, roundsDetail);

  console.log('rejected reconciliation', reconciliation);

  const allProductsFromInventory = await db.inventoryProduct.findMany({
    where: {
      inventoryId,
    },
    select: {
      productId: true,
    },
  });

  // Check for all products that belong to that inventory:
  //  1. If its already in reconciliation (meaning that is was rejected twice and dealt with) ingore it and keep config
  //  2. If it has a review round pick that stock (meaning that is was rejected in original round but passed in review)
  //  3. Else use the original round (meaning inventory checking was ok in the first try)
  allProductsFromInventory.forEach((product) => {
    if (
      !reconciliation.find(
        (reconciledProduct) => reconciledProduct.productId === product.productId
      )
    ) {
      const originalRound = roundsDetail.find(
        (round) =>
          round.name === 'ORIGINAL' &&
          round.round_product_user.find(
            (rpu) => rpu.productId === product.productId
          )
      );

      const reviewRound = roundsDetail.find(
        (round) =>
          round.name === 'REVIEW' &&
          round.round_product_user.find(
            (rpu) => rpu.productId === product.productId
          )
      );

      if (reviewRound) {
        reconciliation.push({
          productId: product.productId,
          reconciledStock: reviewRound.round_product_user.find(
            (rpu) => rpu.productId === product.productId
          )!.currentStock as number,
        }); // cast it because is checked in reviewRound
      } else if (originalRound) {
        reconciliation.push({
          productId: product.productId,
          reconciledStock: originalRound.round_product_user.find(
            (rpu) => rpu.productId === product.productId
          )!.currentStock as number,
        }); // cast it because is checked in reviewRound
      }
    }
  });

  // Finally save reconciled to database
  try {
    await db.$transaction(async (tx) => {
      for (const product of reconciliation) {
        await tx.inventoryProduct.update({
          where: {
            inventoryId_productId: {
              inventoryId,
              productId: product.productId,
            },
          },
          data: {
            reconciledStock: product.reconciledStock,
          },
        });
      }

      await tx.inventory.update({
        where: {
          id: inventoryId,
        },
        data: {
          finished: true,
        },
      });
    });
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getStockDeltaFromInventory = async (inventoryId: string) => {
  const productsData = await db.inventory.findUnique({
    where: {
      id: inventoryId,
    },
    select: {
      finished: true,
      products: {
        select: {
          product: {
            select: {
              id: true,
              price: true,
            },
          },
          initalStock: true,
          reconciledStock: true,
        },
      },
    },
  });

  if (!productsData) {
    return { data: null, error: { message: 'Inventory not found' } };
  }

  if (!productsData.finished) {
    return { data: null, error: { message: 'Inventory not completed yet' } };
  }

  return {
    data: productsData.products.map((product) => ({
      id: product.product.id,
      deltaStock: product.reconciledStock - product.initalStock,
      deltaValue:
        (product.reconciledStock - product.initalStock) * product.product.price,
    })),
    error: null,
  };
};

export const getLastInventory = async () => {
  const { data: currentOrg, error } = await getWorkingOrganization();

  if (error) {
    return { data: null, error };
  }

  const inventory = await db.inventory.findFirst({
    where: {
      organizationId: currentOrg.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return { data: inventory, error: null };
};

type ProductsDeltaRanking = [
  { productId: string; product_name: string; stock_delta: number }
];

// Ranking based on the last 6 months. For now it's a good starting point
export const getProductDeltaRanking = async () => {
  const { data: currentOrg, error } = await getWorkingOrganization();

  if (error) {
    return { data: null, error };
  }

  const sixMonthWindowDate = (date: Date) => {
    date.setMonth(date.getMonth() - 6);
    return date;
  };

  const productsDeltaRanking = await db.$queryRaw<ProductsDeltaRanking>`
    SELECT 
      "InventoryProduct"."productId",
      "Product"."name" as product_name,
      SUM(("InventoryProduct"."reconciledStock" - "InventoryProduct"."initalStock") * "Product"."price") AS stock_delta
    FROM 
      "InventoryProduct"
    INNER JOIN 
      "Inventory" ON "Inventory"."id" = "InventoryProduct"."inventoryId"
    INNER JOIN
      "Product" ON "Product"."id" = "InventoryProduct"."productId"
    WHERE 
      "Inventory"."createdAt" >= CURRENT_DATE - INTERVAL '6 months' AND
      "Inventory"."finished" = true
    GROUP BY 
      "InventoryProduct"."productId",
      "Product"."name"
    ORDER BY 
      stock_delta ASC;
  `;

  return { data: productsDeltaRanking, error: null };
};
