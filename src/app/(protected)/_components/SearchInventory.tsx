'use client';

import { useState } from 'react';
import SearchBar from './tables/SearchBar';
import { Product } from '@prisma/client';

function SearchInventory() {
  const [searchedProducts, setSearchedProducts] = useState<Product | null>(
    null
  );

  return (
    <div>
      <SearchBar />
    </div>
  );
}

export default SearchInventory;
