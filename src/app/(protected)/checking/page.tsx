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

// Current inventory round will be determined by exitance of name: "Round", meaning org user has created a new
const getCurrentInventoryRound = (
  inventoryId: string,
  inventories: Awaited<ReturnType<typeof getOngoingInventories>>['data']
) => {
  const roundInReview = inventories
    ?.find((inv) => inv.id === inventoryId)
    ?.round.some((r) => r.name === 'REVIEW');

  return roundInReview ? 'REVIEW' : 'ORIGINAL';
};

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
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Current Round</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!inventories.error &&
            inventories.data.map((inventory) => (
              <TableRow key={inventory.id}>
                <TableCell>{inventory.id}</TableCell>
                {/* TODO: GET CURRENT ROUND */}
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
