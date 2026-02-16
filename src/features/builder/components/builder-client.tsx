'use client'

import { BuilderCanvas } from '@/features/builder/components/canvas/builder-canvas'
import { ComponentsPalette } from '@/features/builder/components/palette/components-palette'
import { TemplatesPalette } from '@/features/builder/components/panels/templates-palette'
import { AIGeneratePanel } from '@/features/builder/components/panels/ai-generate-panel'
import { Inspector } from '@/features/builder/components/panels/inspector'
import { BuilderToolbar } from '@/features/builder/components/panels/builder-toolbar'
import { LayerTree } from '@/features/builder/components/panels/layer-tree'
import { useBuilderData } from '@/features/builder/hooks/use-builder-data'
import { useBuilderSync } from '@/features/builder/hooks/use-builder-sync'
import { useCanvasStore } from '@/features/builder/stores/canvas-store'
import { IconLoader2 } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface BuilderClientProps {
	projectId: string
}

export function BuilderClient({ projectId }: BuilderClientProps) {
	const { isLoading } = useBuilderData(projectId)
	useBuilderSync()

	const currentPageId = useCanvasStore(state => state.currentPageId)
	const [leftTab, setLeftTab] = useState<'components' | 'templates' | 'ai'>(
		'components',
	)

	// Global keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Delete selected node
			if (e.key === 'Delete' || e.key === 'Backspace') {
				const { selectedNodeId, removeNode } = useCanvasStore.getState()
				if (
					selectedNodeId &&
					!(e.target instanceof HTMLInputElement) &&
					!(e.target instanceof HTMLTextAreaElement)
				) {
					e.preventDefault()
					removeNode(selectedNodeId)
				}
			}
			// Ctrl+Z / Ctrl+Shift+Z for undo/redo
			if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
				e.preventDefault()
				if (e.shiftKey) {
					useCanvasStore.getState().redo()
				} else {
					useCanvasStore.getState().undo()
				}
			}
			// Escape to deselect
			if (e.key === 'Escape') {
				useCanvasStore.getState().selectNode(null)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [])

	if (isLoading) {
		return (
			<div className='h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
				<div className='flex flex-col items-center gap-3'>
					<IconLoader2 className='h-8 w-8 text-blue-500 animate-spin' />
					<p className='text-sm text-gray-500'>Loading builder...</p>
				</div>
			</div>
		)
	}

	return (
		<div className='h-screen flex flex-col'>
			{/* Top Toolbar */}
			<BuilderToolbar projectId={projectId} />

			<div className='flex-1 flex overflow-hidden'>
				{/* Left Sidebar - Components/Templates + Layer Tree */}
				<div className='flex flex-col'>
					{/* Tab switcher */}
					<div className='flex border-b bg-white dark:bg-gray-950'>
						<button
							type='button'
							onClick={() => setLeftTab('components')}
							className={cn(
								'flex-1 px-3 py-2 text-xs font-medium transition-colors border-b-2',
								leftTab === 'components'
									? 'border-blue-500 text-blue-600'
									: 'border-transparent text-gray-500 hover:text-gray-700',
							)}
						>
							Components
						</button>
						<button
							type='button'
							onClick={() => setLeftTab('templates')}
							className={cn(
								'flex-1 px-3 py-2 text-xs font-medium transition-colors border-b-2',
								leftTab === 'templates'
									? 'border-purple-500 text-purple-600'
									: 'border-transparent text-gray-500 hover:text-gray-700',
							)}
						>
							Templates
						</button>
						<button
							type='button'
							onClick={() => setLeftTab('ai')}
							className={cn(
								'flex-1 px-3 py-2 text-xs font-medium transition-colors border-b-2',
								leftTab === 'ai'
									? 'border-violet-500 text-violet-600'
									: 'border-transparent text-gray-500 hover:text-gray-700',
							)}
						>
							AI
						</button>
					</div>
					{leftTab === 'components' ? (
						<ComponentsPalette />
					) : leftTab === 'templates' ? (
						<TemplatesPalette />
					) : (
						<AIGeneratePanel />
					)}
					<LayerTree />
				</div>

				{/* Center - Canvas / Code Editor */}
				<div className='flex-1 flex'>
					{currentPageId ? (
						<BuilderCanvas pageId={currentPageId} />
					) : (
						<div className='flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
							<p className='text-sm text-gray-400'>No page selected</p>
						</div>
					)}
				</div>

				{/* Right Sidebar - Inspector */}
				<Inspector />
			</div>
		</div>
	)
}
