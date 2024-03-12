import { PropsWithChildren } from 'react';
import Header from './_components/Header';
import bgStripes from '../../../public/vanishing-stripes.svg';
import Image from 'next/image';

function LandingLayout({ children }: PropsWithChildren) {
  return (
    <div className='w-full min-h-full flex flex-col items-center bg-landing'>
      <Header />
      {children}
    </div>
  );
}

export default LandingLayout;
