import { getCurrentInventoryRound } from '@/lib/utils';
import InnerDashboardContainer from '../../_components/InnerDashboardContainer';
import Title from '../../_components/forms/Title';
import { getInventoryRoundDetails } from '@/actions/inventory';

async function InventoryCheckingPage({
  params: { inventoryId },
}: {
  params: { inventoryId: string };
}) {
  const { data: roundDetails, error } = await getInventoryRoundDetails(
    inventoryId
  );

  if (error) return;

  return (
    <InnerDashboardContainer>
      <Title size='lg' className='mb-2'>
        Inventory checking
      </Title>
      <Title size='sm' className='mb-2'>
        ID: <span>{inventoryId}</span>
      </Title>
      <Title size='sm' className='mb-2'>
        Round:{' '}
        <span className='capitalize'>{roundDetails.name.toLowerCase()}</span>
      </Title>
    </InnerDashboardContainer>
  );
}

export default InventoryCheckingPage;
