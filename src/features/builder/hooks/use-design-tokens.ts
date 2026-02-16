'use client'

import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/trpc/client'
import { useCanvasStore } from '../stores/canvas-store'

/**
 * Hook to fetch real design tokens from the project's Design System.
 * Uses tRPC v11 pattern: useTRPC() + queryOptions.
 * Returns colors, spacing, typography, and effects tokens.
 */
export function useDesignTokens() {
	const trpc = useTRPC()
	const project = useCanvasStore(state => state.project)

	const { data: designSystem, isLoading } = useQuery({
		...trpc.designSystem.getByProjectId.queryOptions({
			projectId: project?.id ?? '',
		}),
		enabled: !!project?.id,
	})

	const colors = designSystem?.colors ?? []
	const spacing = designSystem?.spacing ?? []
	const typography = designSystem?.typography ?? []
	const effects = designSystem?.effects ?? []

	return {
		isLoading,
		designSystem,
		colors,
		spacing,
		typography,
		effects,
		// Helper to get a color token by name
		getColor: (name: string) => colors.find(c => c.name === name),
		// Helper to get a spacing token by name
		getSpacing: (name: string) => spacing.find(s => s.name === name),
		// Helper to get a typography token by name
		getTypography: (name: string) => typography.find(t => t.name === name),
	}
}
