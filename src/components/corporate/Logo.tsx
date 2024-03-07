import { cn } from '@/lib/utils';
import { Salsa as LogoFont } from 'next/font/google';
import Image from 'next/image';
import appIcon from '../../../public/app-icon.svg';

interface LogoProps {
  withIcon?: boolean;
  className?: string;
}

const logoFont = LogoFont({
  weight: '400',
  subsets: ['latin'],
});

function Logo({ className, withIcon = true }: LogoProps) {
  return (
    <div className='flex items-center justify-start gap-2 px-4 py-2'>
      {withIcon && <Image src={appIcon} width={50} alt='Corporate logo' />}
      <h2 className={cn(className, logoFont.className, 'text-3xl')}>
        Check Delta
      </h2>
    </div>
  );
}

export default Logo;
