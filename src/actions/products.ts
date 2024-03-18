import { db } from '@/lib/db';
import { getWorkingOrganization } from './organization';

export const getProducts = async () => {
  const { data: currentOrganization } = await getWorkingOrganization();

  if (!currentOrganization)
    return { data: null, error: { message: 'Unauthorized' } };

  const response = await db.product.findMany({
    where: {
      organizationId: currentOrganization.id,
    },
  });

  return { data: response, error: null };
};
