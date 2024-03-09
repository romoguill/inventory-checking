import { validateVerificationToken } from '@/auth/token-utils';
import Logo from '@/components/corporate/Logo';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

async function VerificationEmailPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = String(searchParams.token);

  const { error } = await validateVerificationToken(token);

  let message;
  let href;
  let linkLabel;

  switch (error) {
    case null:
      message = 'Email verified successfully!';
      href = '/dashboard';
      linkLabel = 'Start';
      break;
    case 'expired':
      message = 'Token has expired. For your security please generate new one.';
      href = '/';
      linkLabel = 'Generate new';
      break;
    case 'invalid':
      message = 'There was a problem creating your user. Please try again.';
      href = '/auth/register';
      linkLabel = 'Go to register';
      break;
    default:
      message = '';
      href = '';
      linkLabel = '';
  }

  return (
    <div className='border border-slate-400 p-8 flex flex-col items-center shadow-md rounded-xl'>
      <Logo className='self-start mb-6' size='sm' />
      <h1 className='font-semibold mb-4'>{message}</h1>
      <Link href={href} className={buttonVariants({ variant: 'default' })}>
        {linkLabel}
      </Link>
    </div>
  );
}

export default VerificationEmailPage;
