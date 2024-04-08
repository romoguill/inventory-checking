import { getInventoryDetailById } from '@/actions/inventory';
import InnerDashboardContainer from '@/app/(protected)/_components/InnerDashboardContainer';
import Title from '@/app/(protected)/_components/forms/Title';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TableRow {
  product?: string;
  user?: string;
  original?: number;
  review?: number;
}

// Util for formatting response from the server action into simple table
const getTableFormattedData = (
  invetoryDetails: Awaited<ReturnType<typeof getInventoryDetailById>>
): TableRow[] => {
  const productList: { id: string; name: string }[] = [];

  invetoryDetails.data?.products.forEach((item) => {
    productList.push({ id: item.productId, name: item.product.name });
  });

  return productList.map((item) => {
    const rowData: Partial<TableRow> = { product: item.name };

    invetoryDetails.data?.round.forEach((invDetail) => {
      const search = invDetail.round_product_user.find(
        (rpu) => rpu.product.id === item.id
      );
      if (invDetail.name === 'ORIGINAL') {
        rowData.original = search?.currentStock || 0;
        rowData.user = search?.user.name || '';
      } else {
        rowData.review = search?.currentStock || 0;
      }
    });

    return rowData;
  });
};

async function InventoryPage({
  params: { inventoryId },
}: {
  params: { inventoryId: string };
}) {
  const inventoryDetails = await getInventoryDetailById(inventoryId);
  console.log(JSON.stringify(inventoryDetails, undefined, 2));
  let displayMsg: string;

  if (inventoryDetails.error) {
    displayMsg = 'An error occured while retrieving data';
  }

  if (!inventoryDetails.data) {
    displayMsg = 'This inventory has no data';
  }

  const formattedData = getTableFormattedData(inventoryDetails);

  return (
    <InnerDashboardContainer>
      <Title size='lg' className='mb-2'>
        Inventory
        <span className='italic text-lg font-semibold'> ({inventoryId})</span>
      </Title>

      <section>
        <Table className='text-'>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead colSpan={2} className='text-center bg-slate-100/20'>
                Rounds
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>User</TableHead>
              <TableHead className='text-center'>Original</TableHead>
              <TableHead className='text-center'>Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!inventoryDetails.error &&
              inventoryDetails.data &&
              formattedData.map((row) => (
                <TableRow key={row.product}>
                  <TableCell>{row.product}</TableCell>
                  <TableCell>{row.user}</TableCell>
                  <TableCell className='text-center'>{row.original}</TableCell>
                  <TableCell className='text-center'>{row.review}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </section>
    </InnerDashboardContainer>
  );
}

export default InventoryPage;
