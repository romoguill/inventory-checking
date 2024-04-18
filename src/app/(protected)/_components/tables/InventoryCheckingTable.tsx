import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataRow } from '../../dashboard/inventory/[inventoryId]/page';
import { cn } from '@/lib/utils';

type ProductCheckingState =
  | {
      status: 'ok';
      delta: null;
    }
  | {
      status: 'passed';
      delta: number;
    }
  | { status: 'rejected'; delta: number };

const getProductState = (
  initialStock: number | undefined,
  roundResult: number | undefined | null,
  threshold: number | undefined
): ProductCheckingState | null => {
  if (!initialStock || !roundResult || !threshold) {
    return null;
  }
  if (initialStock === roundResult) {
    return {
      status: 'ok',
      delta: null,
    };
  } else if (Math.abs(initialStock - roundResult) <= initialStock * threshold) {
    return {
      status: 'passed',
      delta: roundResult - initialStock,
    };
  } else {
    return {
      status: 'rejected',
      delta: roundResult - initialStock,
    };
  }
};

const isRoundComplete = (round: 'original' | 'review', data: DataRow[]) => {
  if (round === 'original') {
    return data.every((item) => Boolean(item.original));
  } else {
    return data.every((item) => Boolean(item.review));
  }
};

interface InventoryCheckingTableProps {
  data: DataRow[];
  productsThreshold: { id: string; threshold: number }[];
}

function InventoryCheckingTable({
  data,
  productsThreshold,
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
          <TableHead></TableHead>
          <TableHead></TableHead>
          <TableHead></TableHead>
          <TableHead colSpan={2} className='text-center bg-slate-100/20'>
            Rounds
          </TableHead>
        </TableRow>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>User</TableHead>
          <TableHead className='text-center'>Initial stock</TableHead>
          <TableHead className='text-center flex flex-col items-center'>
            Original
            <span>{isRoundComplete('original', data) && '(finished)'}</span>
          </TableHead>
          <TableHead className='text-center'>
            Review
            <span>{isRoundComplete('review', data) && '(finished)'}</span>
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
