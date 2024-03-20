import { getPolicies } from '@/actions/policy';
import PolicyCard from './PolicyCard';

async function PolicyList() {
  const { error, data: policies } = await getPolicies();

  if (error) return null;

  return (
    <section className='grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] w-full gap-8'>
      {policies.map((policy) => (
        <PolicyCard key={policy.name} policy={policy} />
      ))}
    </section>
  );
}

export default PolicyList;
