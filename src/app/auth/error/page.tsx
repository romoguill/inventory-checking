import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { ArrowLeftToLine } from 'lucide-react';
import Link from 'next/link';

// NextAuth redirects here is there is an error. There is a built in page but I want to handle it
function AuthErrorPage() {
  return (
    <Card className='text-center p-4 bg-red-100'>
      <CardHeader className='font-bold text-4xl text-slate-800'>
        Authentication Error
      </CardHeader>
      <CardDescription className='text-xl'>
        <p>
          There was a problem with login/registering to the app. Please try
          again later
        </p>
        <Link
          href={'/auth/login'}
          className='text-blue-600 pt-6 font-semibold flex items-center justify-center gap-1'
        >
          <ArrowLeftToLine size={18} />
          Go back
        </Link>
      </CardDescription>
    </Card>
  );
}

export default AuthErrorPage;
