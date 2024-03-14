import { Button } from '@/components/ui/button';
import SearchBar from './SearchBar';

function TableHeader() {
  return (
    <div className='flex justify-between'>
      <SearchBar placeholder='Search products' className='' />
      <Button className='bg-[#ffd700]'></Button>
    </div>
  );
}

export default TableHeader;
