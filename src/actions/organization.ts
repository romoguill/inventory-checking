'use server';

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
    return { error: 'There was a problem creating an organization' };
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
    return { error: 'Error retrieving organizations' };
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
    return { error: 'Error retrieving organizations' };
  }
};
