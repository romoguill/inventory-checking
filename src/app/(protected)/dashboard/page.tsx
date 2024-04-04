import { Button } from '@/components/ui/button';
import CreateNewInventory from '../_components/CreateNewInventory';
import InnerDashboardContainer from '../_components/InnerDashboardContainer';
import Title from '../_components/forms/Title';
import OngoingInventories from '../_components/OngoingInventories';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function DashboardPage() {
  return (
    <InnerDashboardContainer>
      <Title size='lg' className='mb-4'>
        Dashboard
      </Title>
      <div className='grid grid-cols-[repeat(12,_1fr)] grid-rows-4 w-full h-full'>
        <article className='bg-dashboard-dark rounded-xl col-start-1 col-span-3 flex items-center justify-center'>
          <CreateNewInventory />
        </article>
        <Suspense
          fallback={
            <Skeleton className='bg-dashboard-dark rounded-xl col-start-5 col-span-9 flex flex-grow overflow-hidden p-2' />
          }
        >
          <article className='bg-dashboard-dark rounded-xl col-start-5 col-span-9 flex flex-grow overflow-hidden p-2'>
            <OngoingInventories />
          </article>
        </Suspense>
      </div>
    </InnerDashboardContainer>
  );
}

export default DashboardPage;
