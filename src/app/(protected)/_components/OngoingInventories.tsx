import { getOngoingInventories } from '@/actions/inventory';
import { ScrollArea } from '@/components/ui/scroll-area';

async function OngoingInventories() {
  const { error, data: ongoingInventories } = await getOngoingInventories();

  if (error) {
    console.log(error);
    return;
  }

  if (!ongoingInventories.length) {
    return (
      <div className='w-full h-full flex items-center justify-center text-dashboard-foreground/80'>
        <p>No inventories in progress</p>
      </div>
    );
  }

  return (
    <ScrollArea className='max-h-full w-full p-1'>
      <table className='w-full'>
        <thead className='text-lg'>
          <tr className='sticky top-0 bg-dashboard-dark'>
            <th className='text-left'>id</th>
            <th className='text-center w-24'>created</th>
          </tr>
        </thead>
        <tbody className=''>
          {ongoingInventories.map((inventory) => (
            <tr key={inventory.id}>
              <td>{inventory.id}</td>
              <td className='text-center'>
                {inventory.createdAt.toLocaleDateString('en-CA')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}

export default OngoingInventories;
