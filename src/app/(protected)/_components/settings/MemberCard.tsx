import { User } from '@prisma/client';
import profilePlaceholder from '../../../../../public/profile-pic-placeholder.jpg';
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
    <article className='bg-dashboard-dark/50 shadow-lg rounded-xl overflow-hidden'>
      <div className='bg-[#948566] h-32 flex items-center justify-center pt-12'>
        <Image
          src={member.image || profilePlaceholder}
          alt={`Picture profile of ${member.name}`}
          height={140}
          width={140}
          className='object-cover mx-auto rounded-full'
        />
      </div>
      <div className='flex flex-col pt-12 pb-6 px-3'>
        <h4 className='text-center text-lg font-semibold break-words'>
          {member.name}
        </h4>
        <p className='text-center break-words'>{member.email}</p>
      </div>
    </article>
  );
}

export default MemberCard;
