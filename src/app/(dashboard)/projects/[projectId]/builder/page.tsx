import { BuilderClient } from '@/features/builder/components/builder-client'

interface BuilderPageProps {
	params: Promise<{ projectId: string }>
}

export default async function BuilderPage({ params }: BuilderPageProps) {
	const { projectId } = await params

	return <BuilderClient projectId={projectId} />
}
