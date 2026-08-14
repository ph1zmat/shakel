'use client';

import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Bot, Globe } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTRPC } from '@/trpc/client';

export function NewProjectPage() {
  const router = useRouter();
  const trpc = useTRPC();
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<'WEB' | 'TELEGRAM_BOT'>('WEB');

  const createMutation = useMutation({
    ...trpc.projects.create.mutationOptions(),
    onSuccess: (project) => {
      toast.success('Проект создан успешно!');
      if (project) {
        if (project.platform === 'WEB') {
          router.push(`/web/${project.id}`);
        } else {
          router.push(`/bots/${project.id}`);
        }
      }
    },
    onError: (error) => {
      toast.error(`Ошибка создания проекта: ${error.message}`);
    },
  });

  const handleCreate = async () => {
    if (!name.trim()) return;
    createMutation.mutate({ name, platform });
  };

  return (
    <div className="container max-w-2xl py-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад к проектам
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Создать новый проект</CardTitle>
          <CardDescription>
            Выберите тип проекта и дайте ему название
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Название проекта</Label>
            <Input
              id="name"
              placeholder="Мой проект"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Platform Selection */}
          <div className="space-y-2">
            <Label>Тип проекта</Label>
            <RadioGroup
              value={platform}
              onValueChange={(v) => setPlatform(v as 'WEB' | 'TELEGRAM_BOT')}
              className="grid grid-cols-2 gap-4"
            >
              <Label
                htmlFor="web"
                className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors ${
                  platform === 'WEB'
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-muted'
                }`}
              >
                <RadioGroupItem value="WEB" id="web" className="sr-only" />
                <Globe className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <div className="font-medium">Веб-приложение</div>
                  <div className="text-xs text-muted-foreground">
                    Сайт или веб-app
                  </div>
                </div>
              </Label>

              <Label
                htmlFor="bot"
                className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors ${
                  platform === 'TELEGRAM_BOT'
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-muted'
                }`}
              >
                <RadioGroupItem
                  value="TELEGRAM_BOT"
                  id="bot"
                  className="sr-only"
                />
                <Bot className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <div className="font-medium">Telegram Бот</div>
                  <div className="text-xs text-muted-foreground">
                    Бот для Telegram
                  </div>
                </div>
              </Label>
            </RadioGroup>
          </div>

          {/* Submit */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleCreate}
            disabled={!name.trim() || createMutation.isPending}
          >
            {createMutation.isPending ? 'Создание...' : 'Создать проект'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
