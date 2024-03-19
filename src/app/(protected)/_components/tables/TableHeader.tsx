'use client';

import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { useState } from 'react';
import SearchBar from './SearchBar';
import Link from 'next/link';

function TableHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    setIsModalOpen(open);
  };

  return (
    <div className='flex justify-between my-4'>
      <div className='flex items-center gap-4'>
        <SearchBar placeholder='Search products' className='' />
        <Filter className='bg-dashboard-border' size={30} />
      </div>
      <Link
        href={'/dashboard/products/create'}
        className='bg-dashboard-action hover:bg-dashboard-action/90 hover:text-dashboard-foreground rounded-md flex items-center justify-center p-1 px-3'
      >
        Add new
      </Link>
    </div>
  );
}

export default TableHeader;
