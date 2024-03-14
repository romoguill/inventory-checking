import { Roboto } from 'next/font/google';

import { PropsWithChildren } from 'react';
import AppHeader from '../_components/header/AppHeader';
import Sidebar from '../_components/sidebar/Sidebar';
import { cn } from '@/lib/utils';

function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className='flex flex-col md:grid grid-cols-[230px_1fr] min-h-full grid-rows-[60px_1fr] text-dashboard-foreground'>
      <Sidebar />
      <AppHeader />
      <main className='flex-1 col-start-2 row-start-2 bg-dashboard-light'>
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
