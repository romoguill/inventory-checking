'use client';

import Logo from '@/components/corporate/Logo';
import NavList, { INavItem } from './NavList';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { MenuIcon } from 'lucide-react';

const navItems: INavItem[] = [
  {
    label: 'Product',
    href: '#product',
  },
  {
    label: 'Pricing',
    href: '#pricing',
  },
  {
    label: 'Contact',
    href: '#contact',
  },
];

function Navbar() {
  const session = useSession();

  return (
    <nav className='w-full flex justify-between items-center'>
      <Logo
        size='md'
        className='text-landing-foreground -mt-2'
        withIcon={false}
      />

      <NavList items={navItems} className='hidden md:flex' />

      {
        <Link
          href={session ? '/dashboard' : '/auth/login'}
          className={buttonVariants({
            variant: 'cta',
            className: 'hidden md:inline-flex',
          })}
        >
          Go to App
        </Link>
      }

      <MenuIcon className='md:hidden' />
    </nav>
  );
}

export default Navbar;
