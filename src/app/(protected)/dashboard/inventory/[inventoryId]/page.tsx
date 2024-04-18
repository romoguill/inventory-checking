import { getInventoryDetailById } from '@/actions/inventory';
import { getProductsThreshold } from '@/actions/products';
import InnerDashboardContainer from '@/app/(protected)/_components/InnerDashboardContainer';
import Title from '@/app/(protected)/_components/forms/Title';
import InventoryCheckingTable from '@/app/(protected)/_components/tables/InventoryCheckingTable';

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
  invetoryDetails: Awaited<ReturnType<typeof getInventoryDetailById>>
): DataRow[] => {
  const productList: { id: string; name: string; initialStock: number }[] = [];

  invetoryDetails.data?.products.forEach((item) => {
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

    invetoryDetails.data?.round.forEach((invDetail) => {
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

  return (
    <InnerDashboardContainer>
      <Title size='lg' className='mb-2'>
        Inventory
        <span className='italic text-lg font-semibold'> ({inventoryId})</span>
      </Title>

      <section>
        {!displayMsg ? (
          <InventoryCheckingTable
            data={formattedData}
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
