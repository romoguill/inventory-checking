import Logo from '@/components/corporate/Logo';
import LandingContainer from './LandingContainer';

function Header() {
  return (
    <header className='bg-sky-200 h-20 w-full'>
      <LandingContainer>
        <nav>
          <Logo size='md' />
        </nav>
      </LandingContainer>{' '}
    </header>
  );
}

export default Header;
