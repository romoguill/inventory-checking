import { cn } from '@/lib/utils';
import Link from 'next/link';

import { Montserrat } from 'next/font/google';

const font = Montserrat({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
});

export interface INavItem {
  label: string;
  href: string;
}

interface NavListProps {
  items: INavItem[];
  className?: string;
}

function NavList({ items, className }: NavListProps) {
  return (
    <ul
      className={cn(
        'text-landing-foreground font-bold gap-8 mx-auto',
        className
      )}
    >
      {items.map(({ label, href }) => (
        <li key={label} className={cn(font.className, 'hover:opacity-80')}>
          <Link href={href} className='px-3 py-2'>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default NavList;
