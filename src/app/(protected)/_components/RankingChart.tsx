'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface RankingChartProps {
  data: Record<string, number>[];
}

function RankingChart({ data }: RankingChartProps) {
  console.log(data);
  return (
    <ResponsiveContainer>
      <BarChart data={data} layout='vertical' width={730} height={500}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis type='number' />
        <YAxis dataKey='product_name' type='category' />
        <Tooltip />
        <Legend />
        <Bar dataKey='stock_delta' barSize={20} fill='#8884d8' />
        <ReferenceLine x={0} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default RankingChart;
