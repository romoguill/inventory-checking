'use server';

import { db } from '@/lib/db';
import { getWorkingOrganization } from './organization';
import { getServerAuthSession } from '@/auth/auth.config';

export const getTeamByOrganization = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    return { data: null, error: { message: 'Unauthorized' } };
  }

  const response = await db.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      currentOrg: {
        include: {
          users: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  role: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!response || !response.currentOrg) {
    return { data: null, error: null };
  }

  // Prisma doesn't support yet flattening response when using nested selects
  const flattenedResponse = response.currentOrg.users.map((user) => user.user);

  return { data: flattenedResponse, error: null };
};
