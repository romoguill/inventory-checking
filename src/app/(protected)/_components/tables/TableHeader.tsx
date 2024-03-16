'use client';

import { Button } from '@/components/ui/button';
import SearchBar from './SearchBar';
import { Filter } from 'lucide-react';
import { useState } from 'react';
import ModalForm from '../ModalForm';

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
      <Button
        variant='ghost'
        className='bg-dashboard-action hover:bg-dashboard-action/90 hover:text-dashboard-foreground'
        onClick={() => setIsModalOpen(true)}
      >
        Add new
      </Button>
      <ModalForm open={isModalOpen} onOpenChange={onOpenChange} />
    </div>
  );
}

export default TableHeader;
