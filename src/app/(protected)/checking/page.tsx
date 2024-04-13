import { getServerAuthSession } from '@/auth/auth.config';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import InnerDashboardContainer from '../_components/InnerDashboardContainer';
import Title from '../_components/forms/Title';
import { getOngoingInventories } from '@/actions/inventory';
import Link from 'next/link';
import { getCurrentInventoryRound } from '@/lib/utils';

async function CheckingPage() {
  const session = await getServerAuthSession();

  if (!session) return;

  const inventories = await getOngoingInventories(session.user.id);

  let displayMsg: string = '';

  if (inventories.error) {
    displayMsg = 'An error occured while retrieving data';
  } else if (inventories.data.length) {
    displayMsg = 'This inventory has no data';
  }

  return (
    <InnerDashboardContainer>
      <Title size='lg' className='mb-2'>
        Dashboard
      </Title>
      <Table className='table-fixed'>
        <TableHeader>
          <TableRow className='hover:bg-inherit'>
            <TableHead>ID</TableHead>
            <TableHead className='w-[100px] md:w-[150px] text-center'>
              Round
            </TableHead>
            <TableHead className='w-[100px] md:w-[150px] text-center'>
              Created At
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!inventories.error &&
            inventories.data.map((inventory) => (
              <TableRow key={inventory.id}>
                <TableCell className='p-2 md:p-4 overflow-hidden truncate'>
                  <Link
                    href={`/checking/${inventory.id}`}
                    className='hover:underline'
                  >
                    {inventory.id}
                  </Link>
                </TableCell>
                <TableCell className='p-2 md:p-4 capitalize text-center'>
                  {getCurrentInventoryRound(
                    inventory.id,
                    inventories.data
                  ).toLowerCase()}
                </TableCell>
                <TableCell className='p-2 md:p-4  text-center'>
                  {inventory.createdAt.toLocaleDateString('en-CA')}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </InnerDashboardContainer>
  );
}

export default CheckingPage;
