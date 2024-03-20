import { getServerAuthSession } from '@/auth/auth.config';
import { db } from '@/lib/db';
import { ProductSchema } from '@/schemas/dashboard.schemas';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();

  if (!session || !session.user.email) {
    return NextResponse.json(
      { data: null, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const dbOrganization = await db.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      currentOrgId: true,
    },
  });

  if (!dbOrganization) {
    return NextResponse.json(
      { data: null, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (dbOrganization.currentOrgId == null) {
    return NextResponse.json(
      {
        data: null,
        error: 'Must select which organization to add the product',
      },
      { status: 400 }
    );
  }

  const a = dbOrganization.currentOrgId;
  const payload = await req.json();

  const parsedProduct = ProductSchema.safeParse(payload);

  if (!parsedProduct.success) {
    return new NextResponse('Invalid fields', { status: 400 });
  }

  const { name, imageUrl, batchTracking, severity } = parsedProduct.data;

  try {
    const response = await db.product.create({
      data: {
        name,
        imageUrl,
        batchTracking,
        policy: { connect: { name: severity } },
        organization: { connect: { id: dbOrganization.currentOrgId } },
      },
    });

    return NextResponse.json({ data: response, error: null }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { data: null, error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerAuthSession();

  if (!session || !session.user.email) {
    return NextResponse.json(
      { data: null, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const dbOrganization = await db.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      currentOrgId: true,
    },
  });

  if (!dbOrganization || !dbOrganization.currentOrgId) {
    return NextResponse.json(
      { data: null, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const response = await db.product.findMany({
      where: {
        organizationId: dbOrganization.currentOrgId,
      },
    });

    return NextResponse.json({ data: response, error: null }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { data: null, error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
