import { getProductDeltaRanking } from '@/actions/inventory';

async function RankingProducts() {
  const { data: ranking, error } = await getProductDeltaRanking();
  console.log(ranking);

  if (error) return <p>There was a problem creating rank</p>;

  if (!ranking) return <p>No data to rank</p>;

  return (
    <ul>
      {ranking.map((item) => (
        <li key={item.productId}>
          {item.productId}, {item.stock_delta.toString()}
        </li>
      ))}
    </ul>
  );
}

export default RankingProducts;
