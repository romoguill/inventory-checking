import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

interface LandingContainerProps {
  children: React.ReactNode;
  className?: string;
}

function LandingContainer({ children, className }: LandingContainerProps) {
  return (
    <div
      className={cn(
        'max-w-screen-xl h-full px-4 sm:px-10 flex justify-center mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
}

export default LandingContainer;
