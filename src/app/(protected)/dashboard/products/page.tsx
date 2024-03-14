import InnerDashboardContainer from '../../_components/InnerDashboardContainer';
import Title from '../../_components/forms/Title';
import TableHeader from '../../_components/tables/TableHeader';

function ProductsPage() {
  return (
    <InnerDashboardContainer>
      <Title size='lg'>Products</Title>
      <section>
        <TableHeader />
      </section>
    </InnerDashboardContainer>
  );
}

export default ProductsPage;
