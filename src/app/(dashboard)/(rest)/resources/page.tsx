'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Video, MessageCircle, ExternalLink } from 'lucide-react';

export default function ResourcesPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/projects')}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Ресурсы</h1>
          <p className="text-muted-foreground">Полезные материалы и документация.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5" />
              Документация
            </CardTitle>
            <CardDescription>Подробная документация по использованию платформы.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <a href="/docs" className="flex items-center gap-2">
                Перейти к документации
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="size-5" />
              Видеоуроки
            </CardTitle>
            <CardDescription>Видеогайды по основным функциям.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Видеоуроки будут доступны в ближайшем обновлении.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="size-5" />
              Поддержка
            </CardTitle>
            <CardDescription>Свяжитесь с командой поддержки.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <a href="/contact" className="flex items-center gap-2">
                Написать в поддержку
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
