import { InventoryCreationContext } from '@/app/context/ProductsToBeInventoriedContext';
import { redirect } from 'next/navigation';
import ConfirmInventoryButton from '../../_components/ConfirmInventoryButton';
import InnerDashboardContainer from '../../_components/InnerDashboardContainer';
import SearchInventory from '../../_components/SearchInventory';
import Title from '../../_components/forms/Title';
import ProductsToBeInventoriedList from '../../_components/tables/ProductsToBeInventoriedList';

const allowedPresets = ['custom', 'LOW', 'MEDIUM', 'HIGH'];

async function CreateInventoryPage({
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
      <Title size='lg' className='mb-6'>
        New Inventory Setup
      </Title>

      <InventoryCreationContext>
        <div className='flex justify-between'>
          <Title size='md' className='capitalize mb-4'>
            Preset: {inventoryPreset.toLowerCase()}
          </Title>
          <ConfirmInventoryButton />
        </div>

        <section className='mb-6 relative'>
          <SearchInventory />
        </section>

        <ProductsToBeInventoriedList />
      </InventoryCreationContext>
    </InnerDashboardContainer>
  );
}

export default CreateInventoryPage;
