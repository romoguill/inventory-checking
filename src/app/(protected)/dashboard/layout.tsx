import { PropsWithChildren } from 'react';
import AppHeader from '../_components/header/AppHeader';
import Sidebar from '../_components/sidebar/Sidebar';

function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className='flex flex-col md:grid grid-cols-[230px_1fr] min-h-full grid-rows-[60px_1fr]'>
      <Sidebar />
      <AppHeader />
      {children}
    </div>
  );
}

export default DashboardLayout;
