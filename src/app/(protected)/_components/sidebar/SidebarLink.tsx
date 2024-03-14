'use client';

import { PropsWithChildren } from 'react';
import { TSidebarLink } from './Sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface WrapperProps {
  link: TSidebarLink;
  className?: string;
  children: React.ReactNode;
}

const Wrapper = ({ children, link, className }: WrapperProps) => {
  if (link.type === 'menu') {
    return <div className={className}>{children}</div>;
  } else {
    return (
      <Link href={link.href} className={className}>
        {children}
      </Link>
    );
  }
};

interface SidebarLinkProps {
  link: TSidebarLink;
  className?: string;
}

const isLinkActive = (link: TSidebarLink, pathname: string): boolean => {
  if (link.type === 'link' && link.href === pathname) return true;

  if (link.type === 'menu') {
    return link.children.some((link) => isLinkActive(link, pathname));
  }

  return false;
};

function SidebarLink({ link, className }: SidebarLinkProps) {
  const pathname = usePathname();

  return (
    <li className={className}>
      <Wrapper
        link={link}
        className={cn('flex gap-2 items-center', {
          'bg-dashboard-accent/60': isLinkActive(link, pathname),
        })}
      >
        <link.Icon />
        <span>{link.label}</span>
      </Wrapper>
    </li>
  );
}

export default SidebarLink;
