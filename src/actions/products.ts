'use server';

import { db } from '@/lib/db';
import { getWorkingOrganization } from './organization';

interface GetProductsOptions {
  pagination: {
    cursor: number;
    limit: number;
  };
}

export const getProducts = async (options?: GetProductsOptions) => {
  const { data: currentOrganization } = await getWorkingOrganization();

  if (!currentOrganization)
    return { data: null, error: { message: 'Unauthorized' } };

  if (!options) {
    const response = await db.product.findMany({
      where: {
        organizationId: currentOrganization.id,
      },
      include: {
        policy: true,
      },
    });

    return { data: response, error: null };
  } else {
    const response = await db.product.findMany({
      where: {
        organizationId: currentOrganization.id,
      },
      include: {
        policy: true,
      },
      skip: options.pagination.cursor,
      take: options.pagination.limit,
    });

    return { data: response, error: null };
  }
};

export const findProductsByName = async (name: string) => {
  const { data: currentOrganization } = await getWorkingOrganization();

  if (!currentOrganization)
    return { data: null, error: { message: 'Unauthorized' } };

  const response = await db.product.findMany({
    where: {
      name: {
        equals: `%${name.toLowerCase()}%`,
        mode: 'insensitive',
      },
    },
    take: 5,
  });

  return { data: response, error: null };
};
