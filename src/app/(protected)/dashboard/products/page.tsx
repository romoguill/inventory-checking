import { getProducts } from '@/actions/products';
import InnerDashboardContainer from '../../_components/InnerDashboardContainer';
import Title from '../../_components/forms/Title';
import TableHeader from '../../_components/tables/TableHeader';
import Image from 'next/image';

async function ProductsPage() {
  const response = await getProducts({ pagination: { cursor: 2, limit: 2 } });

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
        {products.map((product) => (
          <div key={product.id}>
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                width={200}
                height={200}
                className='object-cover h-52 w-52'
                alt={`Product ${product.name}`}
              />
            )}
            <p>{product.name}</p>
          </div>
        ))}
      </section>
    </InnerDashboardContainer>
  );
}

export default ProductsPage;
