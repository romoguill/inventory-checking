import LogoutButton from '@/app/auth/_components/LogoutButton';
import { getServerAuthSession } from '@/auth/auth.config';

async function DashboardPage() {
  const session = await getServerAuthSession();

  return (
    <main className='flex-1 col-start-2 row-start-2 bg-dashboard-light'>
      Contents
    </main>
  );
}

export default DashboardPage;
