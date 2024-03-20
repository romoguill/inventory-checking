'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { getWorkingOrganization } from './organization';

export const getPolicies = async () => {
  const response = await db.policy.findMany();

  return { data: response, error: null };
};

export const createPolicy = async (
  data: Prisma.PolicyCreateWithoutOrganizationInput
) => {
  const organization = await getWorkingOrganization();

  if (organization.error) {
    return { data: null, error: { message: 'No organization selected' } };
  }

  try {
    const response = await db.policy.create({
      data: { ...data, organizationId: organization.data.id },
    });

    return { data: response, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: { message: "Couldn't create policy" } };
  }
};

export const updatePolicy = async (
  id: string,
  data: Prisma.PolicyUpdateInput
) => {
  const organization = await getWorkingOrganization();

  if (organization.error) {
    return { data: null, error: { message: 'No organization selected' } };
  }

  try {
    const response = await db.policy.update({
      where: {
        id,
      },
      data,
    });

    return { data: response, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: { message: "Couldn't update policy" } };
  }
};
