import { PropsWithChildren } from 'react';
import Header from './_components/Header';

function LandingLayout({ children }: PropsWithChildren) {
  return (
    <div className='w-full min-h-full flex flex-col items-center'>
      <Header />
      {children}
    </div>
  );
}

export default LandingLayout;
