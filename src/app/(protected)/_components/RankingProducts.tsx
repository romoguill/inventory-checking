import { getProductDeltaRanking } from '@/actions/inventory';
import RankingChart from './RankingChart';

async function RankingProducts() {
  const { data: ranking, error } = await getProductDeltaRanking();
  console.log(ranking);

  if (error) return <p>There was a problem creating rank</p>;

  if (!ranking) return <p>No data to rank</p>;

  return (
    <div className='flex flex-col w-full'>
      <h4 className='text-xl font-semibold mb-2'>Delta Ranking</h4>
      <RankingChart data={ranking} />
    </div>
  );
}

export default RankingProducts;
