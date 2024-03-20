'use server';

import { db } from '@/lib/db';

export const getPolicies = async () => {
  const response = await db.policy.findMany();

  return { data: response, error: null };
};
