import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataRow } from '../../dashboard/inventory/[inventoryId]/page';
import { cn, getProductState } from '@/lib/utils';
import {
  getRounds,
  getRoundsFromInventory,
  isRoundFinished,
} from '@/actions/inventory';
import { Round } from '@prisma/client';

// const isRoundComplete = (round: 'original' | 'review', data: DataRow[]) => {
//   if (round === 'original') {
//     return data.every((item) => Boolean(item.original));
//   } else {
//     return data.every((item) => Boolean(item.review));
//   }
// };

interface InventoryCheckingTableProps {
  inventoryId: string;
  data: DataRow[];
  rounds: {
    id: string;
    isFinished: boolean;
    name: Round;
  }[];
  productsThreshold: { id: string; threshold: number }[];
  reconciliationPhase?: boolean;
}

async function InventoryCheckingTable({
  inventoryId,
  data,
  rounds,
  productsThreshold,
  reconciliationPhase = false,
}: InventoryCheckingTableProps) {
  // Add threshold to table data. Aux for next function
  const dataWithThreshold = data.map((item) => ({
    ...item,
    threshold: productsThreshold.find(
      (product) => product.id === item.product.id
    )?.threshold,
  }));

  // To the product property add the State for each round. Used for populating more easily data in table
  const dataWithState = dataWithThreshold.map((item) => ({
    ...item,
    product: {
      ...item.product,
      stateOriginal: getProductState(
        item.initialStock,
        item.original,
        item.threshold
      ),
      stateReview: getProductState(
        item.initialStock,
        item.review,
        item.threshold
      ),
    },
  }));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {reconciliationPhase && <TableHead></TableHead>}
          <TableHead></TableHead>
          <TableHead></TableHead>
          <TableHead></TableHead>
          <TableHead colSpan={2} className='text-center bg-slate-100/20'>
            Rounds
          </TableHead>
        </TableRow>
        <TableRow>
          {reconciliationPhase && <TableHead>Reconciliation</TableHead>}
          <TableHead>Product</TableHead>
          <TableHead>User</TableHead>
          <TableHead className='text-center'>Initial stock</TableHead>
          <TableHead className='text-center'>
            <div className='flex flex-col items-center'>
              Original
              <span>
                {rounds.find(
                  (round) => round.name === 'ORIGINAL' && round.isFinished
                ) && '(finished)'}
              </span>
            </div>
          </TableHead>
          <TableHead className='text-center'>
            <div className='flex flex-col items-center'>
              Review
              <span>
                {rounds.find(
                  (round) => round.name === 'REVIEW' && round.isFinished
                ) && '(finished)'}
              </span>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dataWithState.map((row) => (
          <TableRow key={row.product.id}>
            <TableCell>{row.product.name}</TableCell>
            <TableCell>{row.user.name}</TableCell>
            <TableCell className='text-center'>{row.initialStock}</TableCell>
            <TableCell
              className={cn('text-center', {
                'text-green-400': row.product.stateOriginal?.status === 'ok',
                'text-amber-400':
                  row.product.stateOriginal?.status === 'passed',
                'text-red-400':
                  row.product.stateOriginal?.status === 'rejected',
              })}
            >
              {row.original}
            </TableCell>
            <TableCell
              className={cn('text-center', {
                'text-green-400': row.product.stateReview?.status === 'ok',
                'text-amber-400': row.product.stateReview?.status === 'passed',
                'text-red-400': row.product.stateReview?.status === 'rejected',
              })}
            >
              {row.review}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default InventoryCheckingTable;
