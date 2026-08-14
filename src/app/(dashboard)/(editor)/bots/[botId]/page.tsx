import { redirect } from 'next/navigation'

interface BotEditorPageProps {
	params: Promise<{ botId: string }>
}

export default async function BotEditorPage({ params }: BotEditorPageProps) {
	const { botId } = await params
	// Redirect to the project builder
	redirect(`/projects/${botId}/builder`)
}
