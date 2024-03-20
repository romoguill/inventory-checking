import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Severity } from '@prisma/client';
import { Ellipsis } from 'lucide-react';

interface PolicyCardProps {
  policy: {
    name: Severity;
    threshold: number;
    frequency: number;
  };
}

function PolicyCard({
  policy: { name, threshold, frequency },
}: PolicyCardProps) {
  return (
    <article className='p-4 bg-dashboard-foreground/10 rounded-xl flex-grow'>
      <div className='flex items-center justify-between'>
        <h2
          className={cn('text-xl capitalize mb-3', {
            'text-green-500': name === Severity.LOW,
            'text-orange-500': name === Severity.MEDIUM,
            'text-red-500': name === Severity.HIGH,
          })}
        >
          {name.toLowerCase()}
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
      <p>
        Delta Threshold:{' '}
        <span>
          {threshold.toLocaleString(undefined, {
            style: 'percent',
            minimumFractionDigits: 1,
          })}
        </span>
      </p>
      <p>
        Frequency: <span>{frequency} days</span>
      </p>
    </article>
  );
}

export default PolicyCard;
