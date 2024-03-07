import Logo from '@/components/corporate/Logo';
import Image from 'next/image';

interface VerificationEmailProps {
  name: string;
  token: string;
}

function VerificationEmal({ name, token }: VerificationEmailProps) {
  return (
    <body className='mx-auto max-w-[500px] bg-slate-100 h-[700px] flex items-center'>
      <div className='bg-white rounded-xl overflow-hidden'>
        <header className='flex justify-center bg-blue-300'>
          <Logo withIcon />
        </header>
        <main className='pl-4 pr-6 py-2 pb-8'>
          <p className='mt-2'>
            Hi, <span>{name}</span>
          </p>
          <h1 className='text-xl mb-2'>Welcome to Check Detla</h1>
          <p className=''>
            Before you can sign in, please click the link below to verify your
            email
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/verify-email?${token}`}
            className='px-3 py-2 bg-violet-500 rounded-md font-semibold text-neutral-50 block text-center w-1/2 mx-auto mt-10'
          >
            Verify Email
          </a>
        </main>
      </div>
    </body>
  );
}

export default VerificationEmal;
