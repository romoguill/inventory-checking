import {
  getInventoryDetailById,
  getRoundsFromInventory,
  isRoundFinished,
} from '@/actions/inventory';
import { getProductsThreshold } from '@/actions/products';
import InnerDashboardContainer from '@/app/(protected)/_components/InnerDashboardContainer';
import Title from '@/app/(protected)/_components/forms/Title';
import InventoryCheckingTable from '@/app/(protected)/_components/tables/InventoryCheckingTable';
import StartReconciliationButton from '@/app/(protected)/_components/tables/StartReconciliationButton';
import StartReviewRoundButton from '@/app/(protected)/_components/tables/StartReviewRoundButton';

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
const getTableFormattedData = (
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

async function InventoryPage({
  params: { inventoryId },
}: {
  params: { inventoryId: string };
}) {
  const inventoryDetails = await getInventoryDetailById(inventoryId);

  let displayMsg: string | undefined;
  if (inventoryDetails.error) {
    displayMsg = 'An error occured while retrieving data';
  }
  if (!inventoryDetails.data) {
    displayMsg = 'This inventory has no data';
  }

  const formattedData = getTableFormattedData(inventoryDetails);

  const productThresholds = await getProductsThreshold(
    inventoryDetails.data?.products.map((product) => product.productId) || []
  );

  const { data: rounds } = await getRoundsFromInventory(inventoryId);

  const roundsWithFinishedInfo = await Promise.all(
    rounds.map(async (round) => ({
      ...round,
      isFinished: await isRoundFinished(round.id),
    }))
  );
  console.log(roundsWithFinishedInfo);
  console.log(
    roundsWithFinishedInfo.find(
      (round) => round.name === 'ORIGINAL' && round.isFinished
    )
  );

  // Display button of lunch review or close whole inventroy based on the round state
  let action: JSX.Element | null = null;
  if (
    roundsWithFinishedInfo.find(
      (round) => round.name === 'ORIGINAL' && round.isFinished
    )
  ) {
    if (
      roundsWithFinishedInfo.find(
        (round) => round.name === 'REVIEW' && !round.isFinished
      )
    ) {
      action = (
        <StartReviewRoundButton
          className='ml-auto w-32'
          inventoryId={inventoryId}
        />
      );
    } else {
      action = (
        <StartReconciliationButton
          className='ml-auto w-36'
          inventoryId={inventoryId}
        />
      );
    }
  }

  return (
    <InnerDashboardContainer>
      <div className='flex flex-start items-center mb-6'>
        <Title size='lg' className='mb-2'>
          Inventory
          <span className='italic text-lg font-semibold lowercase'>
            {' '}
            ({inventoryId})
          </span>
        </Title>
        {action}
      </div>

      <section>
        {!displayMsg ? (
          <InventoryCheckingTable
            inventoryId={inventoryId}
            data={formattedData}
            rounds={roundsWithFinishedInfo}
            productsThreshold={productThresholds.data}
          />
        ) : (
          <p className='mt-6 text-neutral-50/80'>{displayMsg}</p>
        )}
      </section>
    </InnerDashboardContainer>
  );
}

export default InventoryPage;
