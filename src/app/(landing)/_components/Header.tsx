import Logo from '@/components/corporate/Logo';
import LandingContainer from './LandingContainer';
import NavList, { INavItem } from './NavList';

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

function Header() {
  return (
    <header className='h-16 sm:h-20 w-full'>
      <LandingContainer>
        <nav className='w-full flex justify-between items-center'>
          <Logo
            size='md'
            className='text-landing-foreground'
            withIcon={false}
          />
          <NavList items={navItems} isMobile={false} />
        </nav>
      </LandingContainer>{' '}
    </header>
  );
}

export default Header;
