import { ArrowBigDownDash } from 'lucide-react';
import Hero from './_components/Hero';
import Product from './_components/Product/Product';
import LandingContainer from './_components/LandingContainer';

function LandingPage() {
  return (
    <main className='w-full'>
      <Hero />
      <ArrowBigDownDash className='block mx-auto h-10 w-10 my-8 text-orange-600' />
      <LandingContainer className='sm:mx-12 md:mx-32'>
        <Product />
      </LandingContainer>
    </main>
  );
}

export default LandingPage;
