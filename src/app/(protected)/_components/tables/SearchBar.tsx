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
import { Loader2 } from 'lucide-react';
import { SetStateAction, useRef, useState } from 'react';

interface SearchBarProps<T> {
  search: string;
  setSearch: React.Dispatch<SetStateAction<string>>;
  data: T[] | null;
  isLoading: boolean;
  placeholder?: string;
  className?: string;
  renderItem: (item: T) => React.ReactNode;
}

function SearchBar<T extends { id: string }>({
  data,
  isLoading,
  search,
  setSearch,
  placeholder,
  className,
  renderItem,
}: SearchBarProps<T>) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const commandRef = useRef<HTMLDivElement>(null);

  return (
    <Command
      className='bg-dashboard-light relative overflow-visible w-full md:w-[500px]'
      ref={commandRef}
    >
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
        onFocus={() => setIsDropdownOpen(true)}
        onBlur={(e) => {
          // console.log(commandRef.current?.contains(e.target));
          // console.log(e);
          setIsDropdownOpen(false);
        }}
      />
      {isDropdownOpen && (
        <CommandList className='text-dashboard-foreground absolute left-0 right-0 top-16 z-30 rounded-md overflow-hidden bg-dashboard-dark max-h-[400px]'>
          <CommandEmpty>
            {isLoading ? (
              <Loader2 className='animate-spin mx-auto' />
            ) : (
              'No results found'
            )}
          </CommandEmpty>
          {data && (
            <CommandGroup className=''>
              <ScrollArea className='p-2 pr-3'>
                {data?.map((item) => renderItem(item))}
              </ScrollArea>
            </CommandGroup>
          )}
        </CommandList>
      )}
    </Command>
  );
}

export default SearchBar;
