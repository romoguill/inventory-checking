'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

const getFallbackInitials = (name: string) => {
  return name.split(' ').map((word) => word[0].toUpperCase());
};

function UserInfo() {
  const { data: session } = useSession();

  if (!session) {
    return;
  }

  return (
    <article className='flex flex-col justify-end gap-2 p-2 bg-neutral-50/5 mt-auto overflow-hidden'>
      <div className='flex gap-2 mt-auto w-full'>
        <Avatar>
          <AvatarImage src={session.user.image} />
          <AvatarFallback>
            {session.user.name ? getFallbackInitials(session.user.name) : 'XX'}
          </AvatarFallback>
        </Avatar>

        <div className='flex flex-col w-full overflow-hidden'>
          <p className='overflow-hidden text-ellipsis'>{session.user.name}</p>
          <p className='text-sm overflow-hidden text-ellipsis'>
            {session.user.email}
          </p>
        </div>
      </div>
      <Button
        className='self-center px-2 py-0 bg-destructive/80 hover:bg-destructive/90'
        size='sm'
        variant='destructive'
        onClick={() => signOut()}
      >
        <LogOut size={18} />
      </Button>
    </article>
  );
}

export default UserInfo;
