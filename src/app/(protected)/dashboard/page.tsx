import CreateNewInventory from '../_components/CreateNewInventory';
import InnerDashboardContainer from '../_components/InnerDashboardContainer';
import Title from '../_components/forms/Title';

async function DashboardPage() {
  return (
    <InnerDashboardContainer>
      <Title size='lg' className='mb-4'>
        Dashboard
      </Title>
      <div className='grid grid-cols-[repeat(12,_1fr)] grid-rows-2 w-full h-full'>
        <CreateNewInventory />
      </div>
    </InnerDashboardContainer>
  );
}

export default DashboardPage;
