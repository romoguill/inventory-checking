'use server';

import { db } from '@/lib/db';

export const createOrganization = async (userId: string, name: string) => {
  try {
    await db.organization.create({
      data: {
        name,
        owner: {
          connect: {
            id: userId,
          },
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

export const getOrganizationsOwnedBy = async (userId: string) => {
  try {
    const organizations = db.user.findUnique({
      where: {
        id: userId,
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
    return organizations;
  } catch (error) {
    console.log(error);
    return { error: 'Error retrieving organizations' };
  }
};

export const getOrganizationsLinkedTo = async (userId: string) => {
  try {
    const organizations = db.user.findUnique({
      where: {
        id: userId,
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
    return organizations;
  } catch (error) {
    console.log(error);
    return { error: 'Error retrieving organizations' };
  }
};
