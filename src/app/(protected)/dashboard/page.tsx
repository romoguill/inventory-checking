import LogoutButton from '@/app/auth/_components/LogoutButton';
import { getServerAuthSession } from '@/auth/auth.config';

async function DashboardPage() {
  const session = await getServerAuthSession();
  console.log(session?.user.role);

  return (
    <div>
      {JSON.stringify(session)}
      <LogoutButton />
    </div>
  );
}

export default DashboardPage;
