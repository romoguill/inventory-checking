import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function ReconciliationSelect() {
  return (
    <Select>
      <SelectTrigger className='bg-dashboard-dark text-dashboard-foreground'>
        <SelectValue placeholder='Method...' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='average'>Average</SelectItem>
        <SelectItem value='original'>Original</SelectItem>
        <SelectItem value='review'>Review</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default ReconciliationSelect;
