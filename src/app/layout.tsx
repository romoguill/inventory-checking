import { getServerAuthSession } from '@/auth/auth.config';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Roboto } from 'next/font/google';
import { Toaster } from 'sonner';

import './globals.css';
import AuthProvider from './context/AuthProvider';

const globalFont = Roboto({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Check Delta',
  description: 'Keep your inventory in check',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang='en'>
        <body className={globalFont.className}>
          {children}
          <Toaster position='top-right' richColors />
        </body>
      </html>
    </AuthProvider>
  );
}
