'use client';

import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ArrowRight, Bot, Globe, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTRPC } from '@/trpc/client';

export default function ProjectsPage() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.projects.getMany.queryOptions({ page: 1, pageSize: 50 }),
  );

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Проекты</h1>
            <p className="text-muted-foreground">Управление вашими проектами</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-muted" />
              <CardContent className="h-20 bg-muted/50" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const projects = data?.items ?? [];

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Проекты</h1>
          <p className="text-muted-foreground">Управление вашими проектами</p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            Новый проект
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">
              У вас пока нет проектов
            </p>
            <Button asChild>
              <Link href="/projects/new">
                <Plus className="h-4 w-4 mr-2" />
                Создать первый проект
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group hover:border-primary/50 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {project.platform === 'WEB' ? (
                        <Globe className="h-5 w-5 text-primary" />
                      ) : (
                        <Bot className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>
                        {project.platform === 'WEB'
                          ? 'Веб-приложение'
                          : 'Telegram Бот'}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{project._count.pages} страниц</span>
                  <span>
                    Обновлен{' '}
                    {formatDistanceToNow(new Date(project.updatedAt), {
                      addSuffix: true,
                      locale: ru,
                    })}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className="w-full mt-4 group-hover:bg-primary/5"
                  asChild
                >
                  <Link
                    href={
                      project.platform === 'WEB'
                        ? `/web/${project.id}`
                        : `/bots/${project.id}`
                    }
                  >
                    Открыть редактор
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
