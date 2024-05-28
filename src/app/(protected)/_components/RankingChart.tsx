'use client';

import { ProductsDeltaRanking } from '@/actions/inventory';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';

interface RankingChartProps {
  data: ProductsDeltaRanking;
}

function RankingChart({ data }: RankingChartProps) {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<string, number>) => {
    console.log({ active, payload, label });
    if (active && payload && payload.length) {
      return (
        <div className='bg-slate-800 p-2 max-w-[200px]'>
          <p className='label w-full'>{`${label} : ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };
  return (
    <ResponsiveContainer>
      <BarChart
        data={data}
        layout='vertical'
        barSize={100}
        margin={{
          bottom: 10,
        }}
        className='text-dashboard-foreground'
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis type='number' tick={{ fill: '#ddd' }}>
          <Label value='$' position='insideBottom' offset={-8} fill='#ddd' />
        </XAxis>
        <YAxis dataKey='product_name' type='category' tick={{ fill: '#ddd' }} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
        <Bar dataKey='stock_delta' fill='#8884d8' />
        <ReferenceLine x={0} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default RankingChart;
