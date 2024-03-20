import { getPolicies } from '@/actions/policy';
import PolicyCard from './PolicyCard';
import { Policy, Severity } from '@prisma/client';

const policiesPlaceholder: Policy[] = [
  {
    name: Severity.LOW,
    threshold: 0,
    frequency: 0,
    createdAt: new Date(),
    id: Math.random().toString(),
    organizationId: Math.random().toString(),
    updatedAt: new Date(),
  },
  {
    name: Severity.MEDIUM,
    threshold: 0,
    frequency: 0,
    createdAt: new Date(),
    id: Math.random().toString(),
    organizationId: Math.random().toString(),
    updatedAt: new Date(),
  },
  {
    name: Severity.HIGH,
    threshold: 0,
    frequency: 0,
    createdAt: new Date(),
    id: Math.random().toString(),
    organizationId: Math.random().toString(),
    updatedAt: new Date(),
  },
];

async function PolicyList() {
  const { error, data: policies } = await getPolicies();

  if (error) return null;

  // To ensure the customer knows the only 3 types of policies available, I'll render placeholder
  //    to guide them if no policy in DB is found.
  return (
    <section className='grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] w-full gap-8'>
      {policiesPlaceholder.map((placeholder) => {
        let existingPolicy = policies.find(
          (policy) => policy.name === placeholder.name
        );

        if (existingPolicy) {
          return (
            <PolicyCard key={existingPolicy.name} policy={existingPolicy} />
          );
        } else {
          return <PolicyCard key={placeholder.name} policy={placeholder} />;
        }
      })}
    </section>
  );
}

export default PolicyList;
