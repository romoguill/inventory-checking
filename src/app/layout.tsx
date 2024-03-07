import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { auth } from '@/auth/auth';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Check Delta',
  description: 'Keep your inventory in check',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang='en'>
        <body className={inter.className}>
          {children}
          <Toaster position='top-center' richColors />
        </body>
      </html>
    </SessionProvider>
  );
}
