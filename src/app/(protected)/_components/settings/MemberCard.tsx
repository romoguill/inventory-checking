import { User } from '@prisma/client';
import Image from 'next/image';

interface MemberCardProps {
  member: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

function MemberCard({ member }: MemberCardProps) {
  return (
    <article className='bg-dashboard-foreground/10'>
      <Image
        src={member.image}
        alt={`Picture profile of ${member.name}`}
        height={50}
        width={70}
        className='object-cover'
      />
      <div>
        <h4>{member.name}</h4>
        <p>{member.email}</p>
      </div>
    </article>
  );
}

export default MemberCard;
