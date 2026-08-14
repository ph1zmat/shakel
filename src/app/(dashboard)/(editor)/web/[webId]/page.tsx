'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { BuilderLayout } from '@/features/builder/components';
import { useCanvasStore } from '@/features/builder/stores/canvas-store';
import { useTRPC } from '@/trpc/client';

export default function WebBuilderPage() {
  const params = useParams();
  const webId = params.webId as string;
  const trpc = useTRPC();

  const { setProject, setPages, setCurrentPage } = useCanvasStore();

  // Fetch project data from API
  const { data: project, isLoading: isLoadingProject } = useQuery(
    trpc.projects.getById.queryOptions({ id: webId }),
  );

  // Fetch pages for this project
  const { data: pages, isLoading: isLoadingPages } = useQuery(
    trpc.builder.getPages.queryOptions({ projectId: webId }),
  );

  // Initialize store with fetched data
  useEffect(() => {
    if (project) {
      setProject({
        id: project.id,
        name: project.name,
        platform: project.platform,
        designSystemId: project.designSystemId,
      });
    }
  }, [project, setProject]);

  useEffect(() => {
    if (pages && pages.length > 0) {
      setPages(
        pages.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          isEntry: p.isEntry,
        })),
      );
      setCurrentPage(pages[0]?.id ?? null);
    }
  }, [pages, setPages, setCurrentPage]);

  if (isLoadingProject || isLoadingPages) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Проект не найден</h1>
          <p className="text-muted-foreground">Проверьте правильность URL</p>
        </div>
      </div>
    );
  }

  return <BuilderLayout projectId={webId} />;
}
