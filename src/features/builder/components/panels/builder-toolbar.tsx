'use client'

import { useCanvasStore, useCurrentPage } from '../../stores/canvas-store'
import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import {
	IconArrowBackUp,
	IconArrowForwardUp,
	IconEye,
	IconCode,
	IconUpload,
	IconZoomIn,
	IconZoomOut,
	IconLoader2,
	IconAlignLeft,
	IconAlignCenter,
	IconAlignRight,
	IconAlignBoxTopCenter,
	IconAlignBoxCenterMiddle,
	IconAlignBoxBottomCenter,
	IconLayoutDistributeHorizontal,
	IconLayoutDistributeVertical,
} from '@tabler/icons-react'

interface BuilderToolbarProps {
	projectId: string
	onPreview?: () => void
	onPublish?: () => void
	children?: React.ReactNode
}

export function BuilderToolbar({
	projectId: _projectId,
	onPreview,
	onPublish,
	children,
}: BuilderToolbarProps) {
	const trpc = useTRPC()
	const project = useCanvasStore(state => state.project)
	const currentPage = useCurrentPage()
	const pages = useCanvasStore(state => state.pages)
	const setCurrentPage = useCanvasStore(state => state.setCurrentPage)
	const canUndo = useCanvasStore(state => state.canUndo)
	const canRedo = useCanvasStore(state => state.canRedo)
	const undo = useCanvasStore(state => state.undo)
	const redo = useCanvasStore(state => state.redo)
	const zoom = useCanvasStore(state => state.zoom)
	const selectedNodeIds = useCanvasStore(state => state.selectedNodeIds)
	const alignNodes = useCanvasStore(state => state.alignNodes)
	const distributeNodes = useCanvasStore(state => state.distributeNodes)

	const [isGenerating, setIsGenerating] = useState(false)

	const generateCode = useMutation(
		trpc.builder.generateCode.mutationOptions({
			onMutate: () => setIsGenerating(true),
			onSettled: () => setIsGenerating(false),
		}),
	)

	const handleZoomIn = () => {
		useCanvasStore.setState(state => {
			state.zoom = Math.min(state.zoom + 0.1, 2)
		})
	}

	const handleZoomOut = () => {
		useCanvasStore.setState(state => {
			state.zoom = Math.max(state.zoom - 0.1, 0.3)
		})
	}

	const handleZoomReset = () => {
		useCanvasStore.setState(state => {
			state.zoom = 1
		})
	}

	const handleGenerateCode = async () => {
		if (!project) return
		await generateCode.mutateAsync({ projectId: project.id })
	}

	return (
		<div className='h-12 border-b bg-white dark:bg-gray-950 flex items-center px-4 gap-4'>
			{/* Project name */}
			<div className='flex items-center gap-2'>
				<h2 className='text-sm font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[150px]'>
					{project?.name ?? 'Loading...'}
				</h2>
				{project?.platform && (
					<span className='text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500'>
						{project.platform === 'WEB' ? 'Web' : 'Bot'}
					</span>
				)}
			</div>

			{/* Separator */}
			<div className='h-6 w-px bg-gray-200 dark:bg-gray-700' />

			{/* Page selector */}
			<select
				value={currentPage?.id ?? ''}
				onChange={e => setCurrentPage(e.target.value)}
				className='px-2 py-1 text-xs border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 max-w-[140px]'
			>
				{pages.map(page => (
					<option key={page.id} value={page.id}>
						{page.name} {page.isEntry ? '(Entry)' : ''}
					</option>
				))}
			</select>

			{/* Separator */}
			<div className='h-6 w-px bg-gray-200 dark:bg-gray-700' />

			{/* Undo / Redo */}
			<div className='flex items-center gap-1'>
				<ToolbarButton
					icon={<IconArrowBackUp className='h-4 w-4' />}
					onClick={undo}
					disabled={!canUndo}
					title='Undo (Ctrl+Z)'
				/>
				<ToolbarButton
					icon={<IconArrowForwardUp className='h-4 w-4' />}
					onClick={redo}
					disabled={!canRedo}
					title='Redo (Ctrl+Shift+Z)'
				/>
			</div>

			{/* Separator */}
			<div className='h-6 w-px bg-gray-200 dark:bg-gray-700' />

			{/* Zoom controls */}
			<div className='flex items-center gap-1'>
				<ToolbarButton
					icon={<IconZoomOut className='h-4 w-4' />}
					onClick={handleZoomOut}
					title='Zoom Out'
				/>
				<button
					type='button'
					onClick={handleZoomReset}
					className='px-2 py-1 text-xs text-gray-500 hover:text-gray-700 min-w-[40px] text-center'
					title='Reset zoom'
				>
					{Math.round(zoom * 100)}%
				</button>
				<ToolbarButton
					icon={<IconZoomIn className='h-4 w-4' />}
					onClick={handleZoomIn}
					title='Zoom In'
				/>
			</div>

			{/* Separator */}
			<div className='h-6 w-px bg-gray-200 dark:bg-gray-700' />

			{/* Alignment / Distribution (visible when 2+ nodes selected) */}
			{selectedNodeIds.length >= 2 && (
				<div className='flex items-center gap-0.5'>
					<ToolbarButton
						icon={<IconAlignLeft className='h-3.5 w-3.5' />}
						onClick={() => alignNodes('left')}
						title='Align Left'
					/>
					<ToolbarButton
						icon={<IconAlignCenter className='h-3.5 w-3.5' />}
						onClick={() => alignNodes('center')}
						title='Align Center'
					/>
					<ToolbarButton
						icon={<IconAlignRight className='h-3.5 w-3.5' />}
						onClick={() => alignNodes('right')}
						title='Align Right'
					/>
					<div className='h-4 w-px bg-gray-200 dark:bg-gray-700 mx-0.5' />
					<ToolbarButton
						icon={<IconAlignBoxTopCenter className='h-3.5 w-3.5' />}
						onClick={() => alignNodes('top')}
						title='Align Top'
					/>
					<ToolbarButton
						icon={<IconAlignBoxCenterMiddle className='h-3.5 w-3.5' />}
						onClick={() => alignNodes('middle')}
						title='Align Middle'
					/>
					<ToolbarButton
						icon={<IconAlignBoxBottomCenter className='h-3.5 w-3.5' />}
						onClick={() => alignNodes('bottom')}
						title='Align Bottom'
					/>
					{selectedNodeIds.length >= 3 && (
						<>
							<div className='h-4 w-px bg-gray-200 dark:bg-gray-700 mx-0.5' />
							<ToolbarButton
								icon={
									<IconLayoutDistributeHorizontal className='h-3.5 w-3.5' />
								}
								onClick={() => distributeNodes('horizontal')}
								title='Distribute Horizontally'
							/>
							<ToolbarButton
								icon={<IconLayoutDistributeVertical className='h-3.5 w-3.5' />}
								onClick={() => distributeNodes('vertical')}
								title='Distribute Vertically'
							/>
						</>
					)}
				</div>
			)}

			{/* Spacer */}
			<div className='flex-1' />

			{/* Right side actions */}
			<div className='flex items-center gap-2'>
				{children}

				<ToolbarButton
					icon={<IconEye className='h-4 w-4' />}
					onClick={onPreview}
					title='Preview'
				/>

				<ToolbarButton
					icon={
						isGenerating ? (
							<IconLoader2 className='h-4 w-4 animate-spin' />
						) : (
							<IconCode className='h-4 w-4' />
						)
					}
					onClick={handleGenerateCode}
					disabled={isGenerating}
					title='Generate Code'
				/>

				<button
					type='button'
					onClick={onPublish}
					className='px-3 py-1.5 text-xs font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1.5'
				>
					<IconUpload className='h-3.5 w-3.5' />
					Publish
				</button>
			</div>
		</div>
	)
}

function ToolbarButton({
	icon,
	onClick,
	disabled,
	title,
}: {
	icon: React.ReactNode
	onClick?: () => void
	disabled?: boolean
	title?: string
}) {
	return (
		<button
			type='button'
			onClick={onClick}
			disabled={disabled}
			title={title}
			className={cn(
				'p-1.5 rounded-md transition-colors',
				disabled
					? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
					: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-300',
			)}
		>
			{icon}
		</button>
	)
}
