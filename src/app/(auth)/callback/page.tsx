'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(
    'processing',
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        console.error('OAuth error:', error, errorDescription);
        setErrorMsg(errorDescription || error);
        setStatus('error');
        toast.error(errorDescription || 'Ошибка авторизации');
        setTimeout(() => router.push('/login'), 3000);
        return;
      }

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const session = await authClient.getSession();

        if (session.data) {
          setStatus('success');
          toast.success('Вход выполнен успешно!');
          router.push('/projects');
        } else {
          setErrorMsg('Не удалось получить сессию');
          setStatus('error');
          toast.error('Не удалось получить сессию');
          setTimeout(() => router.push('/login'), 2000);
        }
      } catch (err) {
        console.error('[Callback] Error:', err);
        setErrorMsg('Не удалось войти через социальную сеть');
        setStatus('error');
        toast.error('Не удалось войти через социальную сеть');
        router.push('/login');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="relative w-20 h-20 mx-auto mb-6">
          <Image
            src="/logo-white-circle.png"
            alt="Shakel"
            fill
            className="object-contain"
          />
          {status === 'processing' && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </div>

        <h1 className="text-2xl font-bold mb-2">
          {status === 'processing' && 'Завершаем авторизацию...'}
          {status === 'success' && 'Успешно!'}
          {status === 'error' && 'Ошибка авторизации'}
        </h1>

        <p className="text-muted-foreground mb-4">
          {status === 'processing' && 'Проверяем данные...'}
          {status === 'success' && 'Перенаправляем вас...'}
          {status === 'error' && (
            <>
              {errorMsg}
              <br />
              <span className="text-sm">
                Перенаправляем вас на страницу входа...
              </span>
            </>
          )}
        </p>

        {status === 'error' && (
          <button
            onClick={() => router.push('/login')}
            className="text-primary hover:underline underline-offset-4"
          >
            Вернуться на страницу входа
          </button>
        )}
      </motion.div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <motion.div
            className="relative w-20 h-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Image
              src="/logo-white-circle.png"
              alt="Shakel"
              fill
              className="object-contain"
            />
          </motion.div>
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
