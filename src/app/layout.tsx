import { getServerAuthSession } from '@/auth/auth.config';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import AuthProvider from './context/AuthProvider';

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
  const session = await getServerAuthSession();

  return (
    <AuthProvider>
      <html lang='en'>
        <body className={inter.className}>
          {children}
          <Toaster position='top-center' richColors />
        </body>
      </html>
    </AuthProvider>
  );
}
