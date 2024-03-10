import { PropsWithChildren } from 'react';

function LandingContainer({ children }: PropsWithChildren) {
  return (
    <div className='max-w-screen-xl px-4 :px-8 flex justify-center mx-auto'>
      {children}
    </div>
  );
}

export default LandingContainer;
