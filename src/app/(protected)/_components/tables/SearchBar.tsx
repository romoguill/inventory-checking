import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { SetStateAction } from 'react';

interface SearchBarProps<T> {
  search: string;
  setSearch: React.Dispatch<SetStateAction<string>>;
  data: T[] | null;
  placeholder?: string;
  className?: string;
}

function SearchBar<T>({
  data,
  search,
  setSearch,
  placeholder,
  className,
}: SearchBarProps<T>) {
  console.log(data);
  return (
    <Command
      className={cn(
        'flex items-center border-2 rounded-md border-dashboard-border w-3/4 max-w-md',
        className
      )}
    >
      {/* <Label htmlFor='search-field'>
        <LucideSearch className='ml-3 my-[0.3rem]' />
      </Label> */}
      <CommandInput
        id='search-field'
        className='bg-inherit border-none focus-visible:ring-transparent focus-visible:ring-offset-0 ring-transparent placeholder:text-dashboard-foreground/80'
        placeholder={placeholder}
        onValueChange={(search) => setSearch(search)}
        value={search}
        autoComplete='off'
      />
      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>
        <CommandGroup>
          {data?.map((item) => (
            <CommandItem>{item.name}</CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export default SearchBar;
