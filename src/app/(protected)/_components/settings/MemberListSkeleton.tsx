import { Skeleton } from '@/components/ui/skeleton';

function MemberListSkeleton() {
  return (
    <div className='grid grid-cols-[repeat(auto-fill,270px)] gap-4'>
      {new Array(3).fill(0).map((_, i) => (
        <Skeleton key={i} className='h-[250px] bg-dashboard-foreground/10' />
      ))}
    </div>
  );
}

export default MemberListSkeleton;
