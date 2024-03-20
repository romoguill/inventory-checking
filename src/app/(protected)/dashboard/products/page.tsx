import { getProducts } from '@/actions/products';
import InnerDashboardContainer from '../../_components/InnerDashboardContainer';
import Title from '../../_components/forms/Title';
import TableHeader from '../../_components/tables/TableHeader';
import Image from 'next/image';
import ProductCard from '../../_components/products/ProductCard';
import ProductTable from '../../_components/products/ProductList';
import { Suspense } from 'react';
import ProductList from '../../_components/products/ProductList';
import { Loader2 } from 'lucide-react';
import TableLoader from '../../_components/tables/TableLoader';

async function ProductsPage() {
  return (
    <InnerDashboardContainer>
      <Title size='lg'>Products</Title>
      <section>
        <TableHeader />
      </section>
      <section>
        <table className='w-full border-separate border-spacing-y-3 table-fixed text-center'>
          <thead className='font-normal'>
            <tr>
              <th className='w-20'></th>
              <th className='font-normal text-sm'>Name</th>
              <th className='font-normal text-sm'>Current Stock</th>
              <th className='font-normal text-sm'>Batch</th>
              <th className='font-normal text-sm hidden md:table-cell'>
                Severity
              </th>
            </tr>
          </thead>
          <tbody className='relative'>
            <Suspense fallback={<TableLoader />}>
              <ProductList />
            </Suspense>
          </tbody>
        </table>
      </section>
    </InnerDashboardContainer>
  );
}

export default ProductsPage;
