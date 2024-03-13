import {
  AreaChart,
  Box,
  Check,
  Flag,
  Layers,
  LayoutDashboard,
  LucideIcon,
  Settings,
} from 'lucide-react';
import SidebarLink from './SidebarLink';
import Logo from '@/components/corporate/Logo';

export type TSidebarLink =
  | {
      label: string;
      Icon: LucideIcon;
      href: string;
      children: null;
    }
  | {
      label: string;
      Icon: LucideIcon;
      children: TSidebarLink[];
    };

const sidebarLinks: TSidebarLink[] = [
  {
    label: 'Dasboard',
    Icon: LayoutDashboard,
    href: '/dashboard',
    children: null,
  },
  {
    label: 'Management',
    Icon: Layers,
    children: [
      {
        label: 'Products',
        Icon: Box,
        href: '/dashboard/products',
        children: null,
      },
      {
        label: 'Stock policies',
        Icon: Flag,
        href: '/dashboard/policies',
        children: null,
      },
    ],
  },
  {
    label: 'Settings',
    Icon: Settings,
    href: '/dashboard/settings',
    children: null,
  },
];

function Sidebar() {
  return (
    <div className='col-span-1 row-start-1 row-span-2 hidden bg-dashboard-dark md:flex md:flex-col justify-start '>
      <Logo className='ml-6 py-[0.6rem]' />
      <ul className='flex flex-col gap-2 px-3 mt-32'>
        {sidebarLinks.map((link) => (
          <SidebarLink key={link.label} link={link} />
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
