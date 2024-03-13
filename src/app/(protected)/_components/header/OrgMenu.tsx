'use client';

import {
  createOrganization,
  getOrganizationsOwnedBy,
} from '@/actions/organization';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Earth, Loader2, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import CreateOrganizationForm from '../forms/CreateOrganizationForm';

interface OrganizationOwned {
  id: string;
  name: string;
  users: {
    userId: string;
    organizationId: string;
  }[];
}

function OrgMenu() {
  const { data } = useSession();
  const [isPending, setIsPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [availableOrganizations, setAvailableOrganizations] = useState<
    OrganizationOwned[] | null
  >(null);

  const handleGetOrganizations = useCallback(async () => {
    if (!data || !data.user) return;

    setIsPending(true);

    const { error, data: organizations } = await getOrganizationsOwnedBy(
      data.user.email
    );

    if (
      !error &&
      organizations &&
      organizations.organizationsOwned.length > 0
    ) {
      setAvailableOrganizations(organizations.organizationsOwned);
    }

    setIsPending(false);
  }, [data]);

  useEffect(() => {
    handleGetOrganizations();
  }, [handleGetOrganizations]);

  const handleModalOpenChange = (open: boolean) => {
    if (open) {
      setIsMenuOpen(false);
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  };

  // TODO: Trigger should be actual name with icon. Display organizations asociated with user
  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger
          asChild
          className='flex gap-1 items-center justify-between ml-10'
        >
          <Button className='bg-inherit hover:bg-inherit hover:text-dashboard-accent'>
            <Earth />
            <span>My Organization</span>
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' alignOffset={50}>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div className='max-h-40 min-w-52 overflow-y-scroll'>
            {isPending ? (
              <DropdownMenuItem className='pb-3 hover:bg-dashboard-light/20'>
                <Loader2 className='animate-spin mx-auto' />
              </DropdownMenuItem>
            ) : (
              availableOrganizations?.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  className='hover:bg-dashboard-light/20 focus:bg-dashboard-light/20'
                >
                  {org.name}
                </DropdownMenuItem>
              ))
            )}
          </div>
          <DialogTrigger className='flex gap-1 items-center mt-2' asChild>
            <button className='w-full rounded-sm pl-2 py-[0.5rem] text-dashboard-foreground bg-dashboard-dark/90 hover:bg-dashboard-dark/80 focus:bg-dashboard-dark/80 focus:text-dashboard-foreground'>
              <Plus size={16} />
              <span>Add new</span>
            </button>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className='mb-3'>Create a new Organization</DialogTitle>
          <CreateOrganizationForm
            setIsMenuOpen={setIsMenuOpen}
            setIsModalOpen={setIsModalOpen}
            getOrganizations={handleGetOrganizations}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default OrgMenu;
