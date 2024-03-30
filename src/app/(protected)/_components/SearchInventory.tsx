'use client';

import { useEffect, useState } from 'react';
import SearchBar from './tables/SearchBar';
import { Product } from '@prisma/client';
import useDebouncedSearch from '@/hooks/useDebouncedSearch';
import { findProductsByName, getProducts } from '@/actions/products';
import Image from 'next/image';
import ProductSearchItem from './tables/ProductSearchItem';

function SearchInventory() {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[] | null>(null);

  const [isListOpen, setIsListOpen] = useState(false);
  // TODO: Having performance issues with prisma in serverless. Its faster for now to query all DB and filter it in frontend. Maybe comeback later. For production, pagination should be working

  // const debouncedSearch = useDebouncedSearch(search);
  // useEffect(() => {
  //   findProductsByName(debouncedSearch).then(({ data, error }) => {
  //     if (error) return;

  //     setProducts(data);
  //     setIsListOpen(true);
  //   });
  // }, [debouncedSearch]);

  useEffect(() => {
    setIsLoading(true);
    getProducts().then(({ data, error }) => {
      if (error) return;

      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      <SearchBar<Product>
        setSearch={setSearch}
        search={search}
        data={products}
        isLoading={isLoading}
        renderItem={(item) => <ProductSearchItem item={item} />}
      />
    </div>
  );
}

export default SearchInventory;
