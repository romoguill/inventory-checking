'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Earth, Plus } from 'lucide-react';

function OrgMenu() {
  // TODO: Trigger should be actual name with icon. Display organizations asociated with user
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex gap-1 items-center justify-between'>
        <Earth />
        <span>My Organization</span>
        <ChevronDown size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Delivery JIT</DropdownMenuItem>

        <DropdownMenuItem className='flex gap-1 items-center bg-neutral-300/60'>
          <Plus size={16} />
          <span>Add new</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default OrgMenu;
