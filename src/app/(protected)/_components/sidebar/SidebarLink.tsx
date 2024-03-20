'use client';

import { PropsWithChildren } from 'react';
import { TSidebarLink } from './Sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface WrapperProps {
  link: TSidebarLink;
  className?: string;
  children: React.ReactNode;
}

const Wrapper = ({ children, link, className }: WrapperProps) => {
  const pathname = usePathname();
  if (link.type === 'menu') {
    return (
      <Accordion type='multiple' className={className} asChild>
        <ul>
          <AccordionItem
            value={link.label}
            className='w-full border-none flex flex-col'
          >
            <AccordionTrigger
              isActive={isLinkActive(link, pathname)}
              className='flex items-center justify-start gap-2 p-0 hover:no-underline'
            >
              {children}
            </AccordionTrigger>
            <AccordionContent
              asChild
              className='hover:no-underline text-md flex flex-col gap-1 pb-0 pl-3 pt-2'
            >
              {link.children.map((link) => (
                <SidebarLink key={link.label} link={link} />
              ))}
            </AccordionContent>
          </AccordionItem>
        </ul>
      </Accordion>
    );
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
        className={cn('flex gap-2 items-center rounded-sm', {
          'bg-dashboard-accent/60':
            link.type === 'link' && isLinkActive(link, pathname),
          'p-2': link.type === 'link',
        })}
      >
        <link.Icon />
        <span>{link.label}</span>
      </Wrapper>
    </li>
  );
}

export default SidebarLink;
