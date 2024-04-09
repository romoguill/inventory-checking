'use client';

import Logo from '@/components/corporate/Logo';
import {
  Box,
  Flag,
  Layers,
  LayoutDashboard,
  LucideIcon,
  Settings,
} from 'lucide-react';
import SidebarLink from './SidebarLink';
import UserInfo from './UserInfo';
import { Button } from '@/components/ui/button';
import { Prisma, UserRole } from '@prisma/client';

export type TSidebarLink =
  | {
      type: 'link';
      role: UserRole;
      label: string;
      Icon: LucideIcon;
      href: string;
    }
  | {
      type: 'menu';
      role: UserRole;
      label: string;
      Icon: LucideIcon;
      children: TSidebarLink[];
    };

export const sidebarLinks: TSidebarLink[] = [
  {
    type: 'link',
    role: 'ORG_ADMIN',
    label: 'Dasboard',
    Icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    type: 'menu',
    role: 'ORG_ADMIN',
    label: 'Management',
    Icon: Layers,
    children: [
      {
        type: 'link',
        role: 'ORG_ADMIN',
        label: 'Products',
        Icon: Box,
        href: '/dashboard/products',
      },
      {
        type: 'link',
        role: 'ORG_ADMIN',
        label: 'Stock policies',
        Icon: Flag,
        href: '/dashboard/policies',
      },
    ],
  },
  {
    type: 'link',
    role: 'ORG_ADMIN',
    label: 'Settings',
    Icon: Settings,
    href: '/dashboard/settings',
  },
  {
    type: 'link',
    role: 'USER',
    label: 'Dashboard',
    Icon: Settings,
    href: '/checking',
  },
];

interface SidebarProps {
  role: UserRole;
}

function Sidebar({ role }: SidebarProps) {
  return (
    <div className='col-span-1 row-start-1 row-span-2 hidden bg-dashboard-dark md:flex md:flex-col justify-start'>
      <Logo className='ml-6 py-[0.6rem]' />
      <ul className='flex flex-col gap-2 px-3 mt-10'>
        {sidebarLinks.map((link) => (
          <>
            {link.role === role && <SidebarLink key={link.label} link={link} />}
          </>
        ))}
      </ul>
      <UserInfo />
    </div>
  );
}

export default Sidebar;
