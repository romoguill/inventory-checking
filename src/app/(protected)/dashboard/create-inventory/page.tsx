import { redirect } from 'next/navigation';
import InnerDashboardContainer from '../../_components/InnerDashboardContainer';
import Title from '../../_components/forms/Title';
import SearchBar from '../../_components/tables/SearchBar';
import SearchInventory from '../../_components/SearchInventory';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProductsToBeInventoriedList from '../../_components/tables/ProductsToBeInventoriedList';
import { ProductsToBeInventoriedProvider } from '@/app/context/ProductsToBeInventoriedContext';
import ConfirmInventoryButton from '../../_components/ConfirmInventoryButton';

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
      <Title size='lg' className='mb-6'>
        New Inventory Setup
      </Title>

      <ProductsToBeInventoriedProvider>
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
      </ProductsToBeInventoriedProvider>
    </InnerDashboardContainer>
  );
}

export default CreateInventoryPage;
