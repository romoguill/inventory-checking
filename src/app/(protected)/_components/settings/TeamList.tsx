import { getTeamByOrganization } from '@/actions/team';
import MemberCard from './MemberCard';

async function TeamList() {
  const { error, data: teamMembers } = await getTeamByOrganization();

  if (error) return;

  if (!teamMembers) {
    return (
      <p className='text-dashboard-foreground/70 italic'>
        Your organization doesn&apos;t have members yet
      </p>
    );
  }

  return (
    <div className='grid grid-cols-[repeat(auto-fill,270px)] gap-4'>
      {teamMembers.map((user) => (
        <MemberCard key={user.id} member={user} />
      ))}
    </div>
  );
}

export default TeamList;
