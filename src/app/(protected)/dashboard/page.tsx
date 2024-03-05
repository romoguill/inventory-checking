import { auth } from '@/auth/auth';

async function DashboardPage() {
  const session = await auth();

  return <div>{JSON.stringify(session)}</div>;
}

export default DashboardPage;
