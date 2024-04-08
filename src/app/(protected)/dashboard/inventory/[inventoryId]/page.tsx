import { getInventoryDetailById } from '@/actions/inventory';
import InnerDashboardContainer from '@/app/(protected)/_components/InnerDashboardContainer';
import Title from '@/app/(protected)/_components/forms/Title';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';

async function InventoryPage({
  params: { inventoryId },
}: {
  params: { inventoryId: string };
}) {
  const inventoryDetails = await getInventoryDetailById(inventoryId);

  return (
    <InnerDashboardContainer>
      <Title size='lg' className='mb-2'>
        Inventory
        <span className='italic text-lg font-semibold'> ({inventoryId})</span>
      </Title>

      <section>
        <Table>
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
        </Table>
      </section>
    </InnerDashboardContainer>
  );
}

export default InventoryPage;
