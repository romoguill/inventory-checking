import {
  getLastInventory,
  getStockDeltaFromInventory,
} from '@/actions/inventory';
import { cn } from '@/lib/utils';

async function DeltaSummary() {
  const lastInventory = await getLastInventory();

  if (lastInventory.error || !lastInventory.data) {
    return (
      <p className='w-full place-self-center text-center text-dashboard-foreground/80'>
        There was a problem getting the information
      </p>
    );
  }

  const summaryData = await getStockDeltaFromInventory(lastInventory.data?.id);

  if (summaryData.error || !summaryData.data) {
    return (
      <p className='w-full place-self-center text-center text-dashboard-foreground/80'>
        No data to show yet
      </p>
    );
  }

  const sumStock = summaryData.data?.reduce((acc, val) => {
    return acc + val.deltaStock;
  }, 0);

  const sumValue = summaryData.data?.reduce((acc, val) => {
    return acc + val.deltaValue;
  }, 0);

  return (
    <div className='flex flex-col w-full'>
      <h4 className='text-xl font-semibold mb-8'>Last Inventory</h4>
      <div className='flex flex-col justify-center mx-auto'>
        <div className='w-full text-center'>
          <span
            className={cn('text-2xl mr-3', {
              'text-red-500': sumStock < 0,
              'text-green-500': sumStock > 0,
            })}
          >
            {sumStock > 0 && '+'}
            {sumStock}
          </span>
          units
        </div>
        <div className='w-full'>
          <span
            className={cn('text-2xl mr-3', {
              'text-red-500': sumValue < 0,
              'text-green-500': sumValue > 0,
            })}
          >
            {sumValue > 0 && '+'}
            {sumValue.toLocaleString('en', { maximumFractionDigits: 2 })}
          </span>
          USD
        </div>
      </div>
    </div>
  );
}

export default DeltaSummary;
