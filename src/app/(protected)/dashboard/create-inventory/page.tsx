import { redirect } from 'next/navigation';
import InnerDashboardContainer from '../../_components/InnerDashboardContainer';
import Title from '../../_components/forms/Title';
import SearchBar from '../../_components/tables/SearchBar';
import SearchInventory from '../../_components/SearchInventory';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProductsToBeInventoriedList from '../../_components/tables/ProductsToBeInventoriedList';
import { ProductsToBeInventoriedProvider } from '@/app/context/ProductsToBeInventoriedContext';

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

      <Title size='md' className='capitalize mb-4'>
        Preset: {inventoryPreset.toLowerCase()}
      </Title>

      <ProductsToBeInventoriedProvider>
        <section className='mb-6'>
          <SearchInventory />
        </section>

        <ProductsToBeInventoriedList />
      </ProductsToBeInventoriedProvider>
    </InnerDashboardContainer>
  );
}

export default CreateInventoryPage;
