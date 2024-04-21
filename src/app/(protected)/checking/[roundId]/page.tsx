import { getCurrentInventoryRound } from '@/lib/utils';
import InnerDashboardContainer from '../../_components/InnerDashboardContainer';
import Title from '../../_components/forms/Title';
import {
  getInventoryRoundDetails,
  getOngoingInventories,
  isRoundFinished,
} from '@/actions/inventory';
import RoundCheckingForm from '../../_components/forms/RoundCheckingForm';
import { getServerAuthSession } from '@/auth/auth.config';
import { redirect } from 'next/navigation';
import { CircleAlert } from 'lucide-react';

async function InventoryCheckingPage({
  params: { roundId },
}: {
  params: { roundId: string };
}) {
  const session = await getServerAuthSession();

  if (!session) return redirect('/auth/login');

  const finished = await isRoundFinished(roundId);

  const { data: roundDetails, error: detailError } =
    await getInventoryRoundDetails(roundId, session.user.id);

  if (detailError) return;

  return (
    <InnerDashboardContainer>
      <Title size='lg' className='mb-2'>
        Inventory checking
      </Title>
      <Title size='sm' className='mb-2'>
        ID: <span>{roundId}</span>
      </Title>
      <Title size='sm' className='mb-6'>
        Round:{' '}
        <span className='capitalize'>{roundDetails.name.toLowerCase()}</span>
      </Title>
      {finished ? (
        <div className='flex gap-4 items-center justify-center mt-8'>
          <CircleAlert className='text-red-500' size={32} />
          <h5>This round has already been confirmed and closed</h5>
        </div>
      ) : (
        <RoundCheckingForm roundDetails={roundDetails} />
      )}
    </InnerDashboardContainer>
  );
}

export default InventoryCheckingPage;
