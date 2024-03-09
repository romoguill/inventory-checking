import { validateVerificationToken } from '@/auth/token-utils';
import Logo from '@/components/corporate/Logo';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import GenerateTokenButton from '../_components/GenerateTokenButton';
import { db } from '@/lib/db';
import { verifyEmail } from '@/actions/email-verification';

async function VerificationEmailPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = String(searchParams.token);

  const { error } = await validateVerificationToken(token);

  // Only if its expired, retrieve the email to pass it to re generate token
  let email: string = '';
  let name: string | null;
  if (error === 'expired' || error === null) {
    const dbVerificationToken = await db.verificationToken.findUnique({
      where: {
        token,
      },
    });
    // Email must exist, validated before
    email = dbVerificationToken!.email;
  }

  if (!error) {
    await verifyEmail(email);
  }

  let message;
  let action: React.ReactElement;

  switch (error) {
    case null:
      message = 'Email verified successfully!';
      action = (
        <Link
          href={'/auth/login'}
          className={buttonVariants({ variant: 'default' })}
        >
          Sign in
        </Link>
      );
      break;
    case 'expired':
      message =
        'Token has expired. For your security please generate a new one.';
      action = <GenerateTokenButton email={email} name={null} />;
      break;
    case 'invalid':
      message = 'There was a problem creating your user. Please try again.';
      action = (
        <Link
          href={'/auth/register'}
          className={buttonVariants({ variant: 'default' })}
        >
          Return to Sign up
        </Link>
      );
      break;
  }

  return (
    <div className='border border-slate-400 p-8 flex flex-col items-center shadow-md rounded-xl'>
      <Logo className='self-start mb-6' size='sm' />
      <h1 className='font-semibold mb-4'>{message}</h1>
      {action}
    </div>
  );
}

export default VerificationEmailPage;
