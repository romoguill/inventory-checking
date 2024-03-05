import LogoutButton from '@/app/auth/_components/LogoutButton';
import { auth } from '@/auth/auth';

async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      {JSON.stringify(session)}
      <LogoutButton />
    </div>
  );
}

export default DashboardPage;
