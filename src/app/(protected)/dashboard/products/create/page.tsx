import InnerDashboardContainer from '@/app/(protected)/_components/InnerDashboardContainer';
import ProductForm from '@/app/(protected)/_components/forms/ProductForm';

function CreateProductPage() {
  return (
    <InnerDashboardContainer>
      <ProductForm type='create' />
    </InnerDashboardContainer>
  );
}

export default CreateProductPage;
