import { redirect } from 'next/navigation';

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;
  redirect(`/projects/${projectId}/builder`);
}
