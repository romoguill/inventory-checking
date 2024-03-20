import { getProducts } from '@/actions/products';
import ProductCard from './ProductCard';
import TableEmpty from '../tables/TableEmpty';

async function ProductList() {
  // TODO: Backend is ready for pagination. For now its not needed. Maybe do a infinite scroll
  // { pagination: { cursor: x, limit: y } }
  const response = await getProducts();

  console.log(response);

  if (response.error) return null;

  const { data: products } = response;

  if (!products.length) {
    return <TableEmpty />;
  }

  return (
    <>
      {products.map((product) => (
        <tr
          key={product.id}
          className='h-16 md:h-24 rounded-xl mt-3 overflow-hidden'
        >
          <ProductCard product={product} />
        </tr>
      ))}
    </>
  );
}

export default ProductList;
