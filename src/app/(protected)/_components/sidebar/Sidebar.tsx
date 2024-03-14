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

export type TSidebarLink =
  | {
      type: 'link';
      label: string;
      Icon: LucideIcon;
      href: string;
    }
  | {
      type: 'menu';
      label: string;
      Icon: LucideIcon;
      children: TSidebarLink[];
    };

export const sidebarLinks: TSidebarLink[] = [
  {
    type: 'link',
    label: 'Dasboard',
    Icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    type: 'menu',
    label: 'Management',
    Icon: Layers,
    children: [
      {
        type: 'link',
        label: 'Products',
        Icon: Box,
        href: '/dashboard/products',
      },
      {
        type: 'link',
        label: 'Stock policies',
        Icon: Flag,
        href: '/dashboard/policies',
      },
    ],
  },
  {
    type: 'link',
    label: 'Settings',
    Icon: Settings,
    href: '/dashboard/settings',
  },
];

function Sidebar() {
  return (
    <div className='col-span-1 row-start-1 row-span-2 hidden bg-dashboard-dark md:flex md:flex-col justify-start'>
      <Logo className='ml-6 py-[0.6rem]' />
      <ul className='flex flex-col gap-2 px-3 mt-10'>
        {sidebarLinks.map((link) => (
          <SidebarLink key={link.label} link={link} />
        ))}
      </ul>
      <UserInfo />
    </div>
  );
}

export default Sidebar;
