import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataRow } from '../../dashboard/inventory/[inventoryId]/page';

type CheckingState =
  | {
      status: 'ok';
      delta: null;
    }
  | {
      status: 'passed';
      delta: number;
    }
  | { status: 'reject'; delta: number };

const productCheckingState: CheckingState = {};

interface InventoryCheckingTableProps {
  data: DataRow[];
  productsThreshold: { id: string; threshold: number }[];
}

function InventoryCheckingTable({
  data,
  productsThreshold,
}: InventoryCheckingTableProps) {
  console.log(data);
  console.log(productsThreshold);
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
          <TableHead className='text-center'>Original</TableHead>
          <TableHead className='text-center'>Review</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.product}>
            <TableCell>{row.product}</TableCell>
            <TableCell>{row.user}</TableCell>
            <TableCell className='text-center'>{row.initialStock}</TableCell>
            <TableCell className='text-center'>{row.original}</TableCell>
            <TableCell className='text-center'>{row.review}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default InventoryCheckingTable;
