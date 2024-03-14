import { PropsWithChildren } from 'react';

function InnerDashboardContainer({ children }: PropsWithChildren) {
  return <div className='max-w-screen-xl h-full p-4 md:p-8'>{children}</div>;
}

export default InnerDashboardContainer;
