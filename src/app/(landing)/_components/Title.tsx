import { cn } from '@/lib/utils';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

function Title({ children, className }: TitleProps) {
  return (
    <h2
      className={cn(
        'text-2xl sm:text-3xl text-landing-foreground font-black uppercase mt-6 mb-4'
      )}
    >
      {children}
    </h2>
  );
}

export default Title;
