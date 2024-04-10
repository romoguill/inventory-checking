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
      <Table>
        <TableHeader>
          <TableRow className='hover:bg-inherit'>
            <TableHead>ID</TableHead>
            <TableHead>Current Round</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!inventories.error &&
            inventories.data.map((inventory) => (
              <TableRow key={inventory.id}>
                <TableCell>
                  <Link
                    href={`/checking/${inventory.id}`}
                    className='hover:underline'
                  >
                    {inventory.id}
                  </Link>
                </TableCell>
                <TableCell>
                  {getCurrentInventoryRound(inventory.id, inventories.data)}
                </TableCell>
                <TableCell>
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
