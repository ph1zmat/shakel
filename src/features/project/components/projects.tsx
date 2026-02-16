'use client';

import { formatDistanceToNow } from 'date-fns';
import { FolderIcon, GlobeIcon, BotIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from '@/components/entity-components';
import type { Project } from '@/generated/prisma/client';
import { Platform } from '@/generated/prisma/enums';
import { useEntitySearch } from '@/hooks/use-entity-search';
import {
  useRemoveProject,
  useSuspenseProjects,
} from '../hooks/use-projects';
import { useProjectsParams } from '../hooks/use-projects-params';

export const ProjectsSearch = () => {
  const [params, setParams] = useProjectsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Поиск проектов"
    />
  );
};

export const ProjectList = () => {
  const projects = useSuspenseProjects();

  return (
    <EntityList
      items={projects.data.items}
      getKey={(project) => project.id}
      renderItem={(project) => <ProjectItem data={project} />}
      emptyView={<ProjectsEmpty />}
    />
  );
};

export const ProjectsHeader = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter();

  const handleCreate = () => {
    router.push('/projects/new');
  };

  return (
    <EntityHeader
      title="Проекты"
      description="Создавайте и управляйте своими проектами."
      onNew={handleCreate}
      newButtonLabel="Новый проект"
      disabled={disabled}
    />
  );
};

export const ProjectsPagination = () => {
  const projects = useSuspenseProjects();
  const [params, setParams] = useProjectsParams();

  return (
    <EntityPagination
      disabled={projects.isPending}
      page={projects.data.page}
      totalPages={projects.data.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const ProjectsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ProjectsHeader />}
      search={<ProjectsSearch />}
    >
      {children}
    </EntityContainer>
  );
};

export const ProjectsLoading = () => {
  return <LoadingView message="Загрузка проектов..." />;
};

export const ProjectsError = () => {
  return <ErrorView message="Ошибка загрузки проектов." />;
};

export const ProjectsEmpty = () => {
  const router = useRouter();

  const handleCreate = () => {
    router.push('/projects/new');
  };

  return (
    <EmptyView
      onNew={handleCreate}
      message="У вас пока нет проектов. Начните с создания нового проекта."
    />
  );
};

const platformIcon: Record<string, React.ReactNode> = {
  [Platform.WEB]: <GlobeIcon className="size-5 text-muted-foreground" />,
  [Platform.TELEGRAM_BOT]: <BotIcon className="size-5 text-muted-foreground" />,
};

export const ProjectItem = ({ data }: { data: Project & { designSystem?: { id: string; name: string } | null; _count?: { pages: number } } }) => {
  const removeProject = useRemoveProject();

  const handleRemove = () => {
    removeProject.mutate({ id: data.id });
  };

  const icon = platformIcon[data.platform] ?? <FolderIcon className="size-5 text-muted-foreground" />;
  const pagesCount = data._count?.pages ?? 0;

  return (
    <EntityItem
      href={`/projects/${data.id}/builder`}
      title={data.name}
      subtitle={
        <>
          {data.platform === Platform.WEB ? 'Веб' : 'Telegram-бот'}
          {' · '}
          {pagesCount} {pagesCount === 1 ? 'страница' : 'страниц'}
          {' · Обновлён '}
          {formatDistanceToNow(new Date(data.updatedAt), { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          {icon}
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeProject.isPending}
    />
  );
};
