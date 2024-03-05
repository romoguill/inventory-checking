'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

interface LogoutButtonProps {
  label?: string;
}

function LogoutButton({ label = 'Logout' }: LogoutButtonProps) {
  return (
    <Button onClick={() => signOut({ callbackUrl: '/auth/login' })}>
      {label}
    </Button>
  );
}

export default LogoutButton;
