import Logo from '@/components/corporate/Logo';
import LandingContainer from './LandingContainer';
import NavList, { INavItem } from './NavList';
import { getServerAuthSession } from '@/auth/auth.config';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import Navbar from './Navbar';

async function Header() {
  const session = await getServerAuthSession();

  return (
    <header className='h-16 sm:h-20 w-full z-50 bg-landing/70'>
      <LandingContainer>
        <Navbar />
      </LandingContainer>
    </header>
  );
}

export default Header;
