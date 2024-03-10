import { PropsWithChildren } from 'react';

function LandingContainer({ children }: PropsWithChildren) {
  return (
    <div className='max-w-screen-xl h-full px-4 sm:px-10 flex justify-center mx-auto'>
      {children}
    </div>
  );
}

export default LandingContainer;
