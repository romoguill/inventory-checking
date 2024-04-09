'use client';

import {
  createOrganization,
  getOrganizationsLinkedTo,
  getOrganizationsOwnedBy,
  getWorkingOrganization,
  setWorkingOrganization,
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
import { type Organization } from '@prisma/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

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
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null);
  const [isLoadingWorkingOrg, setIsLoadingWorkingOrg] = useState(false);
  const session = useSession();

  useEffect(() => {
    const loadCurrentOrganization = async () => {
      const response = await getWorkingOrganization();

      if (response.error) return;

      response.data && setCurrentOrganization(response.data);
    };

    loadCurrentOrganization();
  }, []);

  const handleGetOrganizations = useCallback(async () => {
    console.log({ data });
    if (!data || !data.user) return;

    setIsPending(true);

    if (data.user.role === 'USER') {
      const { error, data: organizations } = await getOrganizationsLinkedTo(
        data.user.email
      );

      if (!error && organizations && organizations.length > 0) {
        setAvailableOrganizations(organizations);
      }
    } else {
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
    }

    setIsPending(false);
  }, [data]);

  useEffect(() => {
    console.log('useeffect');
    handleGetOrganizations();
  }, [handleGetOrganizations]);

  const handleOrganizationChange = async (name: string) => {
    // setIsLoadingWorkingOrg(true);

    const responseSet = await setWorkingOrganization(name);

    if (responseSet.error) return;

    // const responseGet = await getWorkingOrganization();

    // if (responseGet.error) return;

    // responseGet.data && setCurrentOrganization(responseGet.data.currentOrg);
    window.location.reload();

    setIsLoadingWorkingOrg(false);
  };

  const handleModalOpenChange = (open: boolean) => {
    if (open) {
      setIsMenuOpen(false);
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  };

  console.log('Available organizations', availableOrganizations);

  // TODO: Trigger should be actual name with icon. Display organizations asociated with user
  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger
          asChild
          className='flex gap-1 items-center justify-between ml-10'
        >
          <Button className='bg-inherit hover:bg-inherit hover:text-dashboard-accent'>
            {isLoadingWorkingOrg ? (
              <Skeleton className='h-7 w-32 bg-dashboard-light/70 rounded-sm' />
            ) : !currentOrganization ? (
              <div className='flex gap-2 items-center'>
                Select Organization
                <ChevronDown size={16} />
              </div>
            ) : (
              <>
                <Earth size={18} className='mr-1' />
                <span className='text-lg'>{currentOrganization?.name}</span>
                <ChevronDown size={16} />
              </>
            )}
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
                  onClick={() => handleOrganizationChange(org.id)}
                >
                  {org.name}
                </DropdownMenuItem>
              ))
            )}
          </div>
          {session.data?.user.role === 'ORG_ADMIN' && (
            <DialogTrigger className='flex gap-1 items-center mt-2' asChild>
              <button className='w-full rounded-sm pl-2 py-[0.5rem] text-dashboard-foreground bg-dashboard-dark/90 hover:bg-dashboard-dark/80 focus:bg-dashboard-dark/80 focus:text-dashboard-foreground'>
                <Plus size={16} />
                <span>Add new</span>
              </button>
            </DialogTrigger>
          )}
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
