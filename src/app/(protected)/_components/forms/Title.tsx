import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  size: 'md' | 'lg';
  children: React.ReactNode;
}

function Title({ size = 'lg', className, children, ...props }: TitleProps) {
  const Tag = size === 'md' ? 'h2' : 'h1';

  return (
    <Tag
      {...props}
      className={cn(
        'font-bold tracking-widest capitalize text-dashboard-foreground',
        {
          'text-2xl': size === 'lg',
          'text-xl': size === 'md',
        },
        className
      )}
    >
      {children}
    </Tag>
  );
}

export default Title;
