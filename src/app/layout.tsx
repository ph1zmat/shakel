import { Provider } from '@radix-ui/react-tooltip';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/shared/components/ui/sonner';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
      </body>
    </html>
  );
}
