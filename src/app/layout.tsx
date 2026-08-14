import { Provider } from '@radix-ui/react-tooltip';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import { TRPCReactProvider } from '@/trpc/client';

const gochiSans = localFont({
  src: '../../public/font/Gochi Hand Cyrillic (Regular).otf',
  variable: '--font-gochi-hand',
  weight: '400',
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'Shakel - Простое создание веб-решений',
  description:
    'Создавайте мощные веб-приложения и автоматизируйте задачи без навыков программирования',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${gochiSans.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TRPCReactProvider>
          <ThemeProvider
            attribute={'class'}
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Provider>
              {children}
              <Toaster position="top-center" />
            </Provider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
