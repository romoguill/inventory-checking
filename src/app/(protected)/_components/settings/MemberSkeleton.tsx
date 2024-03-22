import { Skeleton } from '@/components/ui/skeleton';

function MemberSkeleton() {
  return (
    <Skeleton>
      <Skeleton className='w-24 h-10' />
      <Skeleton className='w-20 h-10' />
    </Skeleton>
  );
}

export default MemberSkeleton;
