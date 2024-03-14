import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { LucideSearch } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

function SearchBar({ placeholder, className }: SearchBarProps) {
  return (
    <div
      className={cn(
        'flex items-center border-2 rounded-md border-dashboard-border w-3/4 max-w-md',
        className
      )}
    >
      <Label htmlFor='search-field'>
        <LucideSearch className='ml-3 my-[0.3rem]' />
      </Label>
      <Input
        id='search-field'
        className='bg-inherit border-none focus-visible:ring-transparent focus-visible:ring-offset-0 ring-transparent placeholder:text-dashboard-foreground/80'
        placeholder={placeholder}
      />
    </div>
  );
}

export default SearchBar;
