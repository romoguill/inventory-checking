'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { SetStateAction } from 'react';

interface SearchBarProps<T> {
  search: string;
  setSearch: React.Dispatch<SetStateAction<string>>;
  data: T[] | null;
  placeholder?: string;
  className?: string;
  renderItem: (item: T) => React.ReactNode;
}

function SearchBar<T extends { id: string }>({
  data,
  search,
  setSearch,
  placeholder,
  className,
  renderItem,
}: SearchBarProps<T>) {
  console.log(data);
  return (
    <Command className='bg-dashboard-light relative overflow-visible'>
      {/* <Label htmlFor='search-field'>
        <LucideSearch className='ml-3 my-[0.3rem]' />
      </Label> */}
      <CommandInput
        id='search-field'
        className='placeholder:text-dashboard-foreground text-dashboard-foreground'
        placeholder={placeholder}
        onValueChange={(search) => setSearch(search)}
        value={search}
        autoComplete='off'
      />
      <CommandList className='text-dashboard-foreground absolute left-0 right-0 top-16 z-30 rounded-md overflow-hidden bg-dashboard-dark/90 max-h-[400px]'>
        <CommandEmpty>No results found</CommandEmpty>
        {data && (
          <CommandGroup className=''>
            <ScrollArea className='p-2 pr-3'>
              {data?.map((item) => renderItem(item))}
            </ScrollArea>
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}

export default SearchBar;
