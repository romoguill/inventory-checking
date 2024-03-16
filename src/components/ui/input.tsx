import * as React from 'react';

import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'form' | 'default';
}

const inputVariants = cva(
  'flex h-10 w-full rounded-md  px-3 py-2 text-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border border-input bg-background ring-offset-background placeholder:text-muted-foreground',
        form: 'bg-inherit border-2 border-dashboard-border focus-visible:ring-transparent focus-visible:ring-offset-0 ring-transparent placeholder:text-dashboard-foreground/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
