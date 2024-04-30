'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DataRow,
  ProductCheckingState,
  addStateToTableData,
  addThresholdToTableData,
  cn,
  getProductState,
} from '@/lib/utils';
import {
  getRounds,
  getRoundsFromInventory,
  isRoundFinished,
} from '@/actions/inventory';
import { Round } from '@prisma/client';
import ReconciliationDropdown from './ReconciliationSelect';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Control } from 'react-hook-form';
import { ReconciliationSchema } from '@/schemas/dashboard.schemas';

// const isRoundComplete = (round: 'original' | 'review', data: DataRow[]) => {
//   if (round === 'original') {
//     return data.every((item) => Boolean(item.original));
//   } else {
//     return data.every((item) => Boolean(item.review));
//   }
// };

interface InventoryCheckingTableProps {
  inventoryId: string;
  data: (DataRow & { threshold: number | undefined } & {
    product: {
      stateOriginal: ProductCheckingState | null;
      stateReview: ProductCheckingState | null;
    };
  })[];
  rounds: {
    id: string;
    isFinished: boolean;
    name: Round;
  }[];
  productsThreshold: { id: string; threshold: number }[];
  reconciliationPhase?: boolean;
  formControl?: Control<ReconciliationSchema>;
}

function InventoryCheckingTable({
  inventoryId,
  data,
  rounds,
  productsThreshold,
  reconciliationPhase = false,
  formControl,
}: InventoryCheckingTableProps) {
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
          {reconciliationPhase && <TableHead>Reconciliation</TableHead>}
          <TableHead>Product</TableHead>
          {!reconciliationPhase && <TableHead>User</TableHead>}
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
        {data.map((row, i) => (
          <TableRow key={row.product.id}>
            {reconciliationPhase && (
              <TableCell className='w-[140px]'>
                <FormField
                  control={formControl}
                  name={`reconciliation.${i}.method`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='bg-dashboard-dark text-dashboard-foreground'>
                            <SelectValue placeholder='Method...' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='ORIGINAL'>Original</SelectItem>
                          <SelectItem value='REVIEW'>Review</SelectItem>
                          <SelectItem value='AVERAGE'>Average</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </TableCell>
            )}
            <TableCell>{row.product.name}</TableCell>
            {!reconciliationPhase && <TableCell>{row.user.name}</TableCell>}
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
