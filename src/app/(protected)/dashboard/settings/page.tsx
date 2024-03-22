import { Suspense } from 'react';
import InnerDashboardContainer from '../../_components/InnerDashboardContainer';
import Title from '../../_components/forms/Title';
import ManageTeam from '../../_components/settings/ManageTeam';
import TeamList from '../../_components/settings/TeamList';
import MemberSkeleton from '../../_components/settings/MemberSkeleton';

function SettingsPage() {
  return (
    <InnerDashboardContainer>
      <Title size='lg' className='mb-8'>
        Settings
      </Title>
      <section>
        <Title size='md'>Your team</Title>
        <ManageTeam />
        <Suspense fallback={<MemberSkeleton />}>
          <TeamList />
        </Suspense>
      </section>
    </InnerDashboardContainer>
  );
}

export default SettingsPage;
