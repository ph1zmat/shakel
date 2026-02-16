import { redirect } from 'next/navigation';

interface AutomateEditorPageProps {
  params: Promise<{ automateId: string }>;
}

export default async function AutomateEditorPage({ params }: AutomateEditorPageProps) {
  const { automateId } = await params;
  // Redirect to workflows as automates are managed there
  redirect(`/workflows/${automateId}`);
}
