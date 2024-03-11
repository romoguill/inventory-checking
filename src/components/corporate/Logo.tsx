import { cn } from '@/lib/utils';
import { Salsa as LogoFont } from 'next/font/google';
import Image from 'next/image';
import appIcon from '../../../public/app-icon.svg';

interface LogoProps {
  withIcon?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const logoFont = LogoFont({
  weight: '400',
  subsets: ['latin'],
});

function Logo({ className, withIcon = true, size = 'md' }: LogoProps) {
  return (
    <div className={cn(className, 'flex items-center justify-start gap-2')}>
      {withIcon && (
        <Image
          src={appIcon}
          width={size === 'sm' ? 30 : size === 'md' ? 40 : 60}
          alt='Corporate logo'
        />
      )}
      <h2
        className={cn(logoFont.className, 'mt-1 text-nowrap', {
          'text-xl': size === 'sm',
          'text-2xl': size === 'md',
          'text-3xl': size === 'lg',
        })}
      >
        Check Delta
      </h2>
    </div>
  );
}

export default Logo;
