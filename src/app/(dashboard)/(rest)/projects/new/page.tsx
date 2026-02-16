'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlobeIcon, BotIcon, ArrowLeft } from 'lucide-react';
import { useCreateProject } from '@/features/project/hooks/use-projects';
import { cn } from '@/lib/utils';

type Platform = 'WEB' | 'TELEGRAM_BOT';

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>('WEB');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createProject.mutate(
      { name: name.trim(), platform },
      {
        onSuccess: (data) => {
          if (data) {
            router.push(`/projects/${data.id}/builder`);
          }
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/projects')}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Новый проект</h1>
          <p className="text-muted-foreground">Создайте новый проект для начала работы.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Настройки проекта</CardTitle>
          <CardDescription>Укажите название и платформу проекта.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Название проекта</Label>
              <Input
                id="name"
                placeholder="Мой проект"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label>Платформа</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPlatform('WEB')}
                  className={cn(
                    'flex flex-col items-center gap-3 rounded-lg border p-6 transition-colors cursor-pointer',
                    platform === 'WEB'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50',
                  )}
                >
                  <GlobeIcon className="size-8 text-primary" />
                  <div className="text-center">
                    <p className="font-medium">Веб-сайт</p>
                    <p className="text-xs text-muted-foreground">Создайте веб-приложение</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPlatform('TELEGRAM_BOT')}
                  className={cn(
                    'flex flex-col items-center gap-3 rounded-lg border p-6 transition-colors cursor-pointer',
                    platform === 'TELEGRAM_BOT'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50',
                  )}
                >
                  <BotIcon className="size-8 text-primary" />
                  <div className="text-center">
                    <p className="font-medium">Telegram-бот</p>
                    <p className="text-xs text-muted-foreground">Создайте Telegram-бота</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push('/projects')}>
                Отмена
              </Button>
              <Button type="submit" disabled={!name.trim() || createProject.isPending}>
                {createProject.isPending ? 'Создание...' : 'Создать проект'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
