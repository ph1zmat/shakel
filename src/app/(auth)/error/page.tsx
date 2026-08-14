'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AuthErrorInner() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const getErrorMessage = () => {
    switch (error) {
      case 'access_denied':
        return 'Вы отклонили авторизацию. Попробуйте авторизоваться ещё раз и разрешить доступ.';
      case 'invalid_request':
        return 'Неверный запрос. Проверьте настройки OAuth.';
      case 'invalid_client':
        return 'Неверный client_id. Проверьте настройки Google Cloud.';
      case 'invalid_grant':
        return 'Неверный или просроченный код авторизации. Попробуйте ещё раз.';
      case 'unauthorized_client':
        return 'Доступ не авторизован. Проверьте настройки Google Cloud.';
      case 'unsupported_grant_type':
        return 'Неподдерживаемый тип grant. Проверьте настройки.';
      case 'invalid_scope':
        return 'Запрошенные разрешения недоступны.';
      default:
        return errorDescription || 'Не удалось завершить вход через социальную сеть.';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="relative w-20 h-20 mx-auto mb-6">
          <Image
            src="/logo-white-circle.png"
            alt="Shakel"
            fill
            className="object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold mb-4 text-red-500">
          Ошибка авторизации
        </h1>

        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-600 dark:text-red-400">{getErrorMessage()}</p>
          {error && (
            <p className="text-xs text-red-400 mt-2 font-mono">
              Код ошибки: {error}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="inline-block w-full p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Вернуться на страницу входа
          </Link>

          <div className="text-sm text-muted-foreground mt-4">
            <h3 className="font-semibold mb-2">Возможные решения:</h3>
            <ul className="list-disc list-inside text-left space-y-1">
              <li>Проверьте правильность redirect URI в Google Cloud</li>
              <li>OAuth consent screen не опубликован</li>
              <li>Приложение в статусе &quot;Testing&quot; добавит тестировщиков</li>
              <li>Нет доступа к используемым API</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="relative w-20 h-20">
            <Image
              src="/logo-white-circle.png"
              alt="Shakel"
              fill
              className="object-contain"
            />
          </div>
        </div>
      }
    >
      <AuthErrorInner />
    </Suspense>
  );
}
