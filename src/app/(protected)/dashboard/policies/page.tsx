import { Severity } from '@prisma/client';
import InnerDashboardContainer from '../../_components/InnerDashboardContainer';
import Title from '../../_components/forms/Title';
import PolicyCard from '../../_components/policies/PolicyCard';

const mockData = [
  {
    name: Severity.LOW,
    threshold: 0.07,
    frequency: 120,
  },
  {
    name: Severity.MEDIUM,
    threshold: 0.03,
    frequency: 90,
  },
  {
    name: Severity.HIGH,
    threshold: 0.01,
    frequency: 30,
  },
];

function PoliciesPage() {
  return (
    <InnerDashboardContainer>
      <Title size='lg' className='mb-4'>
        Policies
      </Title>

      <section className='grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] w-full gap-8'>
        {mockData.map((policy) => (
          <PolicyCard key={policy.name} policy={policy} />
        ))}
      </section>
    </InnerDashboardContainer>
  );
}

export default PoliciesPage;
