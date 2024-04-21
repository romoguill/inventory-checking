import { getCurrentInventoryRound } from '@/lib/utils';
import InnerDashboardContainer from '../../_components/InnerDashboardContainer';
import Title from '../../_components/forms/Title';
import {
  getInventoryRoundDetails,
  getOngoingInventories,
} from '@/actions/inventory';
import RoundCheckingForm from '../../_components/forms/RoundCheckingForm';
import { getServerAuthSession } from '@/auth/auth.config';
import { redirect } from 'next/navigation';

async function InventoryCheckingPage({
  params: { inventoryId },
}: {
  params: { inventoryId: string };
}) {
  const session = await getServerAuthSession();

  if (!session) return redirect('/auth/login');

  const { data: roundDetails, error: detailError } =
    await getInventoryRoundDetails(inventoryId, session.user.id);

  if (detailError) return;

  return (
    <InnerDashboardContainer>
      <Title size='lg' className='mb-2'>
        Inventory checking
      </Title>
      <Title size='sm' className='mb-2'>
        ID: <span>{inventoryId}</span>
      </Title>
      <Title size='sm' className='mb-6'>
        Round:{' '}
        <span className='capitalize'>{roundDetails.name.toLowerCase()}</span>
      </Title>
      <RoundCheckingForm roundDetails={roundDetails} />
    </InnerDashboardContainer>
  );
}

export default InventoryCheckingPage;
