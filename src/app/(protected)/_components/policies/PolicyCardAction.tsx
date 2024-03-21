'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import { usePolicy } from './PolicyContext';
import PolicyForm from '../forms/PolicyForm';
import { Policy } from '@prisma/client';
import { useState } from 'react';

interface PolicyCardActionProps {
  policy: Policy;
}

function PolicyCardAction({ policy }: PolicyCardActionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      setIsMenuOpen(false);
      setIsDialogOpen(true);
    } else {
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DropdownMenu
        open={isMenuOpen}
        onOpenChange={(open) => setIsMenuOpen(open)}
      >
        <DropdownMenuTrigger>
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DialogTrigger className='w-full text-start focus:bg-dashboard-light/5 hover:bg-dashboard-light/5 px-2 hover:text-dashboard-accent focus:text-dashboard-accent'>
            Edit
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogTitle>
          <h4>
            {policy.name} <span>(policy)</span>
          </h4>
        </DialogTitle>
        <PolicyForm
          type='update'
          policy={policy}
          handleDialogOpenChange={handleDialogOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}

export default PolicyCardAction;
