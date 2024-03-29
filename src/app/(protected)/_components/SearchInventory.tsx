'use client';

import { useEffect, useState } from 'react';
import SearchBar from './tables/SearchBar';
import { Product } from '@prisma/client';
import useDebouncedSearch from '@/hooks/useDebouncedSearch';
import { findProductsByName } from '@/actions/products';
import Image from 'next/image';
import ProductSearchItem from './tables/ProductSearchItem';

function SearchInventory() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[] | null>(null);
  const debouncedSearch = useDebouncedSearch(search);

  const [isListOpen, setIsListOpen] = useState(false);

  useEffect(() => {
    findProductsByName(debouncedSearch).then(({ data, error }) => {
      if (error) return;

      setProducts(data);
      setIsListOpen(true);
    });
  }, [debouncedSearch]);

  const content = <div></div>;

  return (
    <div>
      <SearchBar<Product>
        setSearch={setSearch}
        search={search}
        data={products}
        renderItem={(item) => <ProductSearchItem item={item} />}
      />
    </div>
  );
}

export default SearchInventory;
