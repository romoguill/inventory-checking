import LogoutButton from '@/app/auth/_components/LogoutButton';
import { getServerAuthSession } from '@/auth/auth.config';

async function DashboardPage() {
  const session = await getServerAuthSession();
  console.log(session);

  return <div>Dashboard page</div>;
}

export default DashboardPage;
