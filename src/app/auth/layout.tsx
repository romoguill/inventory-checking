import { PropsWithChildren } from 'react';

function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className='mx-auto max-w-[900px] h-full flex justify-center items-center px-[5%]'>
      {children}
    </div>
  );
}

export default AuthLayout;
