'use server';

import { getServerAuthSession } from '@/auth/auth.config';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const createOrganization = async (email: string, name: string) => {
  try {
    await db.organization.create({
      data: {
        name,
        owner: {
          connect: {
            email,
          },
        },
        usersWorking: {
          connect: [{ email }],
        },
      },
    });

    return {
      success: `${name} created`,
    };
  } catch (error) {
    console.log(error);
    return {
      error: { message: 'There was a problem creating an organization' },
    };
  }
};

export const getOrganizationsOwnedBy = async (email: string) => {
  try {
    const organizations = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        organizationsOwned: {
          select: {
            id: true,
            name: true,
            users: true,
          },
        },
      },
    });
    return { data: organizations };
  } catch (error) {
    console.log(error);
    return { error: { message: 'Error retrieving organizations' } };
  }
};

export const getOrganizationsLinkedTo = async (email: string) => {
  try {
    const organizations = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        organizationsLinked: {
          select: {
            organization: {
              select: {
                id: true,
                name: true,
                users: true,
              },
            },
          },
        },
      },
    });
    return { data: organizations };
  } catch (error) {
    console.log(error);
    return { error: { message: 'Error retrieving organizations' } };
  }
};

export const setWorkingOrganization = async (id: string) => {
  const session = await getServerAuthSession();
  if (!session) return { error: 'No user detected' };

  try {
    await db.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        currentOrgId: id,
      },
    });

    revalidatePath('/dashboard');

    return { success: 'Updated current organization' };
  } catch (error) {
    console.log(error);
    return { error: { message: "Couldn't change organization" } };
  }
};

export const getWorkingOrganization = async () => {
  const session = await getServerAuthSession();
  if (!session) return { error: { message: 'No user detected' }, data: null };

  try {
    const response = await db.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        currentOrg: true,
      },
    });

    if (response && response.currentOrg)
      return { data: response.currentOrg, error: null };

    return { data: null, error: { message: null } };
  } catch (error) {
    console.log(error);
    return { error: { message: "Couldn't get organization" }, data: null };
  }
};
