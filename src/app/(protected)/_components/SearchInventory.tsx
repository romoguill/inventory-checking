'use client';

import { getProducts } from '@/actions/products';
import { useProductsToBeInventoriedContext } from '@/app/context/ProductsToBeInventoriedContext';
import { Product } from '@prisma/client';
import { useEffect, useState } from 'react';
import ProductSearchItem from './tables/ProductSearchItem';
import SearchBar from './tables/SearchBar';

function SearchInventory() {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setProducts: setProductsSelected } =
    useProductsToBeInventoriedContext();
  const [products, setProducts] = useState<Product[]>([]);

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
  }, [setProducts]);

  return (
    <div>
      <SearchBar<Product>
        setSearch={setSearch}
        search={search}
        data={products}
        isLoading={isLoading}
        renderItem={(item) => (
          <ProductSearchItem
            key={item.id}
            item={item}
            onSelect={() => setProductsSelected((prev) => [...prev, item])}
          />
        )}
      />
    </div>
  );
}

export default SearchInventory;
