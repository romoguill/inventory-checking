import { getProducts } from '@/actions/products';
import InnerDashboardContainer from '../../_components/InnerDashboardContainer';
import Title from '../../_components/forms/Title';
import TableHeader from '../../_components/tables/TableHeader';
import Image from 'next/image';
import ProductCard from '../../_components/products/ProductCard';

async function ProductsPage() {
  // TODO: Backend is ready for pagination. For now its not needed. Maybe do a infinite scroll
  // { pagination: { cursor: x, limit: y } }
  const response = await getProducts();

  if (response.error) return null;

  const { data: products } = response;

  console.log(products);

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
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className='h-16 md:h-24 rounded-xl mt-3 overflow-hidden'
              >
                <ProductCard product={product} />
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </InnerDashboardContainer>
  );
}

export default ProductsPage;
