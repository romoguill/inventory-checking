import { getInventoryDetailById } from '@/actions/inventory';

async function InventoryPage({
  params: { inventoryId },
}: {
  params: { inventoryId: string };
}) {
  const inventoryDetails = await getInventoryDetailById(inventoryId);

  console.log(JSON.stringify(inventoryDetails));
  return <div>InventoryPage</div>;
}

export default InventoryPage;
