interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { projectId } = await params;

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold">Проект {projectId}</h1>
      <p className="text-muted-foreground">Страница проекта в разработке</p>
    </div>
  );
}
