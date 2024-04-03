import { redirect } from 'next/navigation';
import InnerDashboardContainer from '../../_components/InnerDashboardContainer';
import Title from '../../_components/forms/Title';
import SearchBar from '../../_components/tables/SearchBar';
import SearchInventory from '../../_components/SearchInventory';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProductsToBeInventoriedList from '../../_components/tables/ProductsToBeInventoriedList';
import { InventoryCreationContext } from '@/app/context/ProductsToBeInventoriedContext';
import ConfirmInventoryButton from '../../_components/ConfirmInventoryButton';
import { createInventory } from '@/actions/inventory';

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

  const mockData = [
    {
      productId: 'clu8k4ows0001mfgmk7r4kr4g',
      userId: 'clu1f0p0500005ftbr5113ilg',
    },
    {
      productId: 'clud6o9jp0001pbh0eg9a5682',
      userId: 'clu1f0p0500005ftbr5113ilg',
    },
    {
      productId: 'clud6pc8w0002pbh0mqvqmccx',
      userId: 'clu1up6tx00035ftbx0n519dr',
    },
  ];

  await createInventory(mockData);

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
