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

interface PolicyCardActionProps {
  name: string;
  threshold: number;
  frequency: number;
}

function PolicyCardAction({}) {
  const policy = usePolicy();

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger>
            <span>Edit</span>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogTitle>
          <h4>{policy?.name}</h4>
        </DialogTitle>
        <PolicyForm type='update' />
      </DialogContent>
    </Dialog>
  );
}

export default PolicyCardAction;
