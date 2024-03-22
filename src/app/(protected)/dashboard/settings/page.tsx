import { Suspense } from 'react';
import InnerDashboardContainer from '../../_components/InnerDashboardContainer';
import Title from '../../_components/forms/Title';
import ManageTeam from '../../_components/settings/ManageTeam';
import MemberListSkeleton from '../../_components/settings/MemberListSkeleton';
import TeamList from '../../_components/settings/TeamList';

function SettingsPage() {
  return (
    <InnerDashboardContainer>
      <Title size='lg' className='mb-8'>
        Settings
      </Title>
      <section>
        <div className='flex justify-between items-center mb-4'>
          <Title size='md'>Your team</Title>
          <ManageTeam />
        </div>
        <Suspense fallback={<MemberListSkeleton />}>
          <TeamList />
        </Suspense>
      </section>
    </InnerDashboardContainer>
  );
}

export default SettingsPage;
