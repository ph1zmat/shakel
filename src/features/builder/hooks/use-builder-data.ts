'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/trpc/client'
import {
	useCanvasStore,
	type ComponentNode as StoreNode,
} from '../stores/canvas-store'

/**
 * Hook for loading project data into the canvas store.
 * Uses the correct tRPC v11 pattern: useTRPC() + queryOptions/mutationOptions.
 */
export function useBuilderData(projectId: string) {
	const trpc = useTRPC()
	const setProject = useCanvasStore(state => state.setProject)
	const setPages = useCanvasStore(state => state.setPages)
	const currentPageId = useCanvasStore(state => state.currentPageId)

	// Load project
	const { data: project, isLoading: projectLoading } = useQuery(
		trpc.projects.getOne.queryOptions({ id: projectId }),
	)

	// Load pages
	const { data: pages, isLoading: pagesLoading } = useQuery({
		...trpc.builder.getPages.queryOptions({ projectId }),
		enabled: !!project,
	})

	// Load page tree when page is selected
	const { data: pageTree, isLoading: treeLoading } = useQuery({
		...trpc.builder.getPageTree.queryOptions({ pageId: currentPageId ?? '' }),
		enabled: !!currentPageId,
	})

	// Set project in store
	useEffect(() => {
		if (project) {
			setProject({
				id: project.id,
				name: project.name,
				platform: project.platform as 'WEB' | 'TELEGRAM_BOT',
				designSystemId: project.designSystemId,
			})
		}
	}, [project, setProject])

	// Set pages in store
	useEffect(() => {
		if (pages) {
			setPages(
				pages.map(p => ({
					id: p.id,
					name: p.name,
					slug: p.slug,
					isEntry: p.isEntry,
				})),
			)
		}
	}, [pages, setPages])

	// Set nodes in store
	useEffect(() => {
		if (pageTree?.nodes) {
			const normalized: Record<string, StoreNode> = {}
			for (const node of pageTree.nodes) {
				const raw = node as Record<string, unknown>
				const storeNode: StoreNode = {
					id: node.id,
					type: node.type,
					parentId: node.parentId,
					pageId: node.pageId,
					order: node.order,
					props: (node.props as Record<string, unknown>) ?? {},
					styles: (node.styles as unknown as StoreNode['styles']) ?? {
						base: {},
					},
					interactions: (node.interactions ?? []).map(i => ({
						id: i.id,
						trigger: i.trigger as StoreNode['interactions'][0]['trigger'],
						type: i.type as StoreNode['interactions'][0]['type'],
						config: (i.config as Record<string, unknown>) ?? {},
						order: i.order,
					})),
					// Free positioning defaults
					position: (raw.position as StoreNode['position']) ?? {
						x: 0,
						y: node.order * 60,
					},
					size: (raw.size as StoreNode['size']) ?? { width: 200, height: 48 },
					rotation: (raw.rotation as number) ?? 0,
					zIndex: (raw.zIndex as number) ?? node.order,
					opacity: (raw.opacity as number) ?? 1,
					locked: (raw.locked as boolean) ?? false,
					visible: (raw.visible as boolean) ?? true,
					constraints: (raw.constraints as StoreNode['constraints']) ?? {
						horizontal: 'left',
						vertical: 'top',
					},
					effects: (raw.effects as StoreNode['effects']) ?? [],
					animations: (raw.animations as StoreNode['animations']) ?? [],
				}
				normalized[node.id] = storeNode
			}

			useCanvasStore.setState(state => {
				state.nodes = normalized
			})
		}
	}, [pageTree])

	return {
		isLoading: projectLoading || pagesLoading || treeLoading,
		project,
		pages,
	}
}
