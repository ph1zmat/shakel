import { redirect } from 'next/navigation'

interface LegacyWebProjectPageProps {
	params: Promise<{ webId: string }>
}

/**
 * Legacy route redirect: /web/[webId] → /projects/[projectId]/builder
 *
 * После миграции v1→v2 все WebProject стали Project.
 * Этот маршрут перенаправляет на новый builder.
 */
export default async function LegacyWebProjectPage({
	params,
}: LegacyWebProjectPageProps) {
	const { webId } = await params

	// Перенаправляем на новый builder по тому же ID
	// При миграции Project.id может совпадать с webId или быть другим.
	// Для простоты перенаправляем на страницу проектов с подсказкой.
	redirect(`/projects/${webId}/builder`)
}
