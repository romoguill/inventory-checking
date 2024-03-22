'use client';

import { addUserToOrganization } from '@/actions/organization';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import MemberForm from '../forms/MemberForm';
import { useState } from 'react';

function ManageTeam() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button>Add member</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className='mb-2'>
            <DialogTitle>Add a user to your Organization</DialogTitle>
          </DialogHeader>
          <MemberForm setIsModalOpen={setIsModalOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ManageTeam;
