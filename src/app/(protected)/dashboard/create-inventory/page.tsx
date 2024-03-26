import { redirect } from 'next/navigation';
import InnerDashboardContainer from '../../_components/InnerDashboardContainer';
import Title from '../../_components/forms/Title';
import SearchBar from '../../_components/tables/SearchBar';
import SearchInventory from '../../_components/SearchInventory';

const allowedPresets = ['custom', 'LOW', 'MEDIUM', 'HIGH'];

function CreateInventoryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const inventoryPreset = searchParams.selection;
  console.log(inventoryPreset);
  if (!inventoryPreset || !allowedPresets.includes(inventoryPreset)) {
    redirect('/dashboard');
  }

  return (
    <InnerDashboardContainer>
      <Title size='lg' className='mb-4'>
        New Inventory Setup
      </Title>
      <Title size='md' className='capitalize'>
        Preset: {inventoryPreset.toLowerCase()}
      </Title>
      <section>
        <SearchInventory />
      </section>
    </InnerDashboardContainer>
  );
}

export default CreateInventoryPage;
