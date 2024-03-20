import { cn } from '@/lib/utils';
import { Policy, Severity } from '@prisma/client';
import { PolicyProvider } from './PolicyContext';
import PolicyCardAction from './PolicyCardAction';

interface PolicyCardProps {
  policy: Policy;
}

function PolicyCard({ policy }: PolicyCardProps) {
  return (
    <PolicyProvider policy={policy}>
      <article className='p-4 bg-dashboard-foreground/10 rounded-xl flex-grow'>
        <div className='flex items-center justify-between'>
          <h2
            className={cn('text-xl capitalize mb-3', {
              'text-green-500': policy.name === Severity.LOW,
              'text-orange-500': policy.name === Severity.MEDIUM,
              'text-red-500': policy.name === Severity.HIGH,
            })}
          >
            {policy.name.toLowerCase()}
          </h2>
          <PolicyCardAction />
        </div>
        <p>
          Delta Threshold:{' '}
          <span>
            {policy.threshold.toLocaleString(undefined, {
              style: 'percent',
              minimumFractionDigits: 1,
            })}
          </span>
        </p>
        <p>
          Frequency: <span>{policy.frequency} days</span>
        </p>
      </article>
    </PolicyProvider>
  );
}

export default PolicyCard;
