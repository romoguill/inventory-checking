import Logo from '@/components/corporate/Logo';
import LandingContainer from './LandingContainer';
import NavList, { INavItem } from './NavList';
import { getServerAuthSession } from '@/auth/auth.config';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

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

async function Header() {
  const session = await getServerAuthSession();

  return (
    <header className='h-16 sm:h-20 w-full z-50 bg-landing/70'>
      <LandingContainer>
        <nav className='w-full flex justify-between items-center'>
          <Logo
            size='md'
            className='text-landing-foreground -mt-2'
            withIcon={false}
          />
          <NavList items={navItems} isMobile={false} />
          {
            <Link
              href={session ? '/dashboard' : '/auth/login'}
              className={buttonVariants({ variant: 'cta' })}
            >
              Go to App
            </Link>
          }
        </nav>
      </LandingContainer>
    </header>
  );
}

export default Header;
