'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Bell, Shield, Palette } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/projects')}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Настройки</h1>
          <p className="text-muted-foreground">Управляйте настройками своего аккаунта.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Профиль
            </CardTitle>
            <CardDescription>Информация о вашем аккаунте.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Настройки профиля будут доступны в ближайшем обновлении.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-5" />
              Уведомления
            </CardTitle>
            <CardDescription>Управление уведомлениями.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Настройки уведомлений будут доступны в ближайшем обновлении.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5" />
              Безопасность
            </CardTitle>
            <CardDescription>Пароль и безопасность.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Настройки безопасности будут доступны в ближайшем обновлении.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="size-5" />
              Внешний вид
            </CardTitle>
            <CardDescription>Тема и оформление.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Настройки оформления будут доступны в ближайшем обновлении.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
