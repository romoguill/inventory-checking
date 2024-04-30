import {
  getInventoryDetailById,
  getOngoingInventories,
} from '@/actions/inventory';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Current inventory round will be determined by exitance of name: "Round", meaning org user has created a new
export const getCurrentInventoryRound = (
  inventoryId: string,
  inventories: Awaited<ReturnType<typeof getOngoingInventories>>['data']
) => {
  const roundInReview = inventories
    ?.find((inv) => inv.id === inventoryId)
    ?.round.some((r) => r.name === 'REVIEW');

  return roundInReview ? 'REVIEW' : 'ORIGINAL';
};

export type ProductCheckingState =
  | {
      status: 'ok';
      delta: null;
    }
  | {
      status: 'passed';
      delta: number;
    }
  | { status: 'rejected'; delta: number };

export const getProductState = (
  initialStock: number | undefined,
  roundStock: number | undefined | null,
  threshold: number | undefined | null
): ProductCheckingState | null => {
  if (!initialStock || !roundStock || !threshold) {
    return null;
  }
  if (initialStock === roundStock) {
    return {
      status: 'ok',
      delta: null,
    };
  } else if (Math.abs(initialStock - roundStock) <= initialStock * threshold) {
    return {
      status: 'passed',
      delta: roundStock - initialStock,
    };
  } else {
    return {
      status: 'rejected',
      delta: roundStock - initialStock,
    };
  }
};

export interface DataRow {
  product: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
  };
  initialStock?: number;
  original?: number | null;
  review?: number | null;
}

// Util for formatting response from the server action into simple table
export const getTableFormattedData = (
  inventoryDetails: Awaited<ReturnType<typeof getInventoryDetailById>>
): DataRow[] => {
  const productList: { id: string; name: string; initialStock: number }[] = [];

  inventoryDetails.data?.products.forEach((item) => {
    productList.push({
      id: item.productId,
      name: item.product.name,
      initialStock: item.initalStock,
    });
  });

  return productList.map((item) => {
    const rowData: Partial<DataRow> = {
      product: {
        id: item.id,
        name: item.name,
      },
      initialStock: item.initialStock,
    };

    inventoryDetails.data?.round.forEach((invDetail) => {
      const search = invDetail.round_product_user.find(
        (rpu) => rpu.product.id === item.id
      );
      if (invDetail.name === 'ORIGINAL') {
        rowData.original = search?.currentStock;
        rowData.user = {
          id: search?.user.id || '',
          name: search?.user.name || '',
        };
      } else {
        rowData.review = search?.currentStock;
      }
    });

    return rowData;
  }) as DataRow[];
};

// Add threshold to table data. Aux for next function
export const addThresholdToTableData = (
  data: DataRow[],
  productsThreshold: { id: string; threshold: number }[]
) => {
  const dataWithThreshold = data.map((item) => ({
    ...item,
    threshold: productsThreshold.find(
      (product) => product.id === item.product.id
    )?.threshold,
  }));

  return dataWithThreshold;
};

// To the product property add the State for each round. Used for populating more easily data in table
export const addStateToTableData = (
  data: (DataRow & { threshold: number | undefined })[]
) => {
  const dataWithState = data.map((item) => ({
    ...item,
    product: {
      ...item.product,
      stateOriginal: getProductState(
        item.initialStock,
        item.original,
        item.threshold
      ),
      stateReview: getProductState(
        item.initialStock,
        item.review,
        item.threshold
      ),
    },
  }));

  return dataWithState;
};
