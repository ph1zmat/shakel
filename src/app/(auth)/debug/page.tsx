'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';

export default function AuthDebugPage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    authClient.getSession().then((s) => {
      setSession(s);
    });
  }, []);

  const testGoogle = async () => {
    try {
      console.log('Testing Google OAuth...');
      const result = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/projects',
      });
      console.log('Google result:', result);
    } catch (e) {
      console.error('Google error:', e);
    }
  };

  const testGithub = async () => {
    try {
      console.log('Testing GitHub OAuth...');
      const result = await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/projects',
      });
      console.log('GitHub result:', result);
    } catch (e) {
      console.error('GitHub error:', e);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>

      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h2 className="font-semibold mb-2">Session:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className="space-y-3">
        <button
          onClick={testGoogle}
          className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Test Google OAuth
        </button>
        <button
          onClick={testGithub}
          className="w-full p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
        >
          Test GitHub OAuth
        </button>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">
          Проверьте в консоли:
        </h3>
        <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
          <li>Откройте DevTools (F12)</li>
          <li>Перейдите на вкладку Console</li>
          <li>Нажмите кнопку теста</li>
          <li>Смотрите логи</li>
        </ol>
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        <h3 className="font-semibold mb-2">Важные настройки Google OAuth:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Authorized redirect URIs должен содержать:{' '}
            <code className="bg-muted px-1">
              http://localhost:3000/api/auth/callback/google
            </code>
          </li>
          <li>OAuth consent screen должен быть настроен (External)</li>
          <li>Scopes: email, profile</li>
          <li>Test users добавлены (если в статусе Testing)</li>
        </ul>
      </div>
    </div>
  );
}
