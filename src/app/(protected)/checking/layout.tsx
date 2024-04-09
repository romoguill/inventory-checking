import { PropsWithChildren } from 'react';
import AppHeader from '../_components/header/AppHeader';
import Sidebar from '../_components/sidebar/Sidebar';

function CheckingLayout({ children }: PropsWithChildren) {
  return (
    <div className='flex flex-col md:grid grid-cols-[230px_1fr] h-screen grid-rows-[60px_1fr] text-dashboard-foreground'>
      <Sidebar />
      <AppHeader />
      <main className='flex-1 col-start-2 row-start-2 h-full bg-dashboard-light overflow-hidden'>
        {children}
      </main>
    </div>
  );
}

export default CheckingLayout;
