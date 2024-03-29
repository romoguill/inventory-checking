'use client';

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
    <Command className='bg-dashboard-light'>
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
      <CommandList className='text-dashboard-foreground'>
        <CommandEmpty>No results found</CommandEmpty>
        <CommandGroup className='bg-dashboard-dark/90'>
          <CommandItem>Gi</CommandItem>
          {data?.map((item) => renderItem(item))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export default SearchBar;
