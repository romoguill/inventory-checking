'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
  label?: string;
}

function LogoutButton({ label = 'Logout' }: LogoutButtonProps) {
  const router = useRouter();

  const logout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
    router.refresh();
  };

  return <Button onClick={logout}>{label}</Button>;
}

export default LogoutButton;
