import { getProducts } from '@/actions/products';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useDebouncedSearch from '@/hooks/useDebouncedSearch';
import { cn } from '@/lib/utils';
import { Product } from '@prisma/client';
import { LucideSearch } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  withDropdown?: boolean;
}

function SearchBar({
  placeholder,
  className,
  withDropdown = false,
}: SearchBarProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedSearch(search);
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    getProducts().then(({ data, error }) => {
      if (error) return;

      setProducts(data);
    });
  }, [debouncedSearch]);

  console.log(products);

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
        onChange={(e) => setSearch(e.target.value)}
      />

      {products?.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}

export default SearchBar;
