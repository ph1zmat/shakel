'use client'

import { useCanvasStore } from '../../stores/canvas-store'
import { getComponentDefinition } from '@/lib/codegen/component-registry'
import { cn } from '@/lib/utils'
import { useState, useCallback, type MouseEvent } from 'react'
import {
	IconChevronRight,
	IconLock,
	IconEyeOff,
	IconFolder,
	IconFolderOpen,
	IconAlignLeft,
	IconAlignCenter,
	IconAlignRight,
	IconLayoutDistributeHorizontal,
	IconLayoutDistributeVertical,
} from '@tabler/icons-react'

export function LayerTree() {
	const getRootNodes = useCanvasStore(state => state.getRootNodes)
	const selectedNodeIds = useCanvasStore(state => state.selectedNodeIds)
	const alignNodes = useCanvasStore(state => state.alignNodes)
	const distributeNodes = useCanvasStore(state => state.distributeNodes)
	const groupNodes = useCanvasStore(state => state.groupNodes)
	const rootNodes = getRootNodes()

	const showMultiTools = selectedNodeIds.length >= 2

	return (
		<div className='border-t'>
			<div className='p-3 border-b flex items-center justify-between'>
				<h3 className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
					Layers
				</h3>
				{selectedNodeIds.length > 1 && (
					<span className='text-[9px] bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 px-1.5 py-0.5 rounded'>
						{selectedNodeIds.length} selected
					</span>
				)}
			</div>

			{/* Multi-select toolbar */}
			{showMultiTools && (
				<div className='px-2 py-1.5 border-b bg-gray-50 dark:bg-gray-900 flex flex-wrap gap-0.5'>
					<ToolButton
						icon={<IconAlignLeft className='h-3 w-3' />}
						title='Align left'
						onClick={() => alignNodes('left')}
					/>
					<ToolButton
						icon={<IconAlignCenter className='h-3 w-3' />}
						title='Align center'
						onClick={() => alignNodes('center')}
					/>
					<ToolButton
						icon={<IconAlignRight className='h-3 w-3' />}
						title='Align right'
						onClick={() => alignNodes('right')}
					/>
					<div className='w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5 self-center' />
					<ToolButton
						icon={<IconLayoutDistributeHorizontal className='h-3 w-3' />}
						title='Distribute H'
						onClick={() => distributeNodes('horizontal')}
					/>
					<ToolButton
						icon={<IconLayoutDistributeVertical className='h-3 w-3' />}
						title='Distribute V'
						onClick={() => distributeNodes('vertical')}
					/>
					<div className='w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5 self-center' />
					<ToolButton
						icon={<IconFolder className='h-3 w-3' />}
						title='Group'
						onClick={() => groupNodes()}
					/>
				</div>
			)}

			<div className='p-1'>
				{rootNodes.map(node => (
					<LayerItem key={node.id} nodeId={node.id} depth={0} />
				))}
				{rootNodes.length === 0 && (
					<div className='text-xs text-gray-400 text-center py-3'>
						No components yet
					</div>
				)}
			</div>
		</div>
	)
}

function ToolButton({
	icon,
	title,
	onClick,
}: {
	icon: React.ReactNode
	title: string
	onClick: () => void
}) {
	return (
		<button
			type='button'
			onClick={onClick}
			className='p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors'
			title={title}
		>
			{icon}
		</button>
	)
}

function LayerItem({ nodeId, depth }: { nodeId: string; depth: number }) {
	const node = useCanvasStore(state => state.nodes[nodeId])
	const getChildNodes = useCanvasStore(state => state.getChildNodes)
	const selectedNodeId = useCanvasStore(state => state.selectedNodeId)
	const selectedNodeIds = useCanvasStore(state => state.selectedNodeIds)
	const selectNode = useCanvasStore(state => state.selectNode)
	const selectNodes = useCanvasStore(state => state.selectNodes)
	const expandedNodeIds = useCanvasStore(state => state.expandedNodeIds)
	const toggleExpanded = useCanvasStore(state => state.toggleExpanded)
	const toggleNodeLock = useCanvasStore(state => state.toggleNodeLock)
	const toggleNodeVisibility = useCanvasStore(
		state => state.toggleNodeVisibility,
	)
	const removeNode = useCanvasStore(state => state.removeNode)
	const ungroupNodes = useCanvasStore(state => state.ungroupNodes)

	const [showContextMenu, setShowContextMenu] = useState(false)

	const handleClick = useCallback(
		(e: MouseEvent) => {
			if (e.ctrlKey || e.metaKey) {
				e.stopPropagation()
				const newIds = selectedNodeIds.includes(nodeId)
					? selectedNodeIds.filter(id => id !== nodeId)
					: [...selectedNodeIds, nodeId]
				selectNodes(newIds)
			} else if (e.shiftKey) {
				e.stopPropagation()
				if (!selectedNodeIds.includes(nodeId)) {
					selectNodes([...selectedNodeIds, nodeId])
				}
			} else {
				selectNode(nodeId)
			}
		},
		[nodeId, selectedNodeIds, selectNode, selectNodes],
	)

	const handleContextMenu = useCallback((e: MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setShowContextMenu(true)

		const handleClose = () => {
			setShowContextMenu(false)
			window.removeEventListener('click', handleClose)
		}
		window.addEventListener('click', handleClose)
	}, [])

	if (!node) return null

	const def = getComponentDefinition(node.type)
	const children = getChildNodes(nodeId)
	const isSelected = selectedNodeId === nodeId
	const isMultiSelected =
		selectedNodeIds.includes(nodeId) && selectedNodeIds.length > 1
	const isExpanded = expandedNodeIds.includes(nodeId)
	const hasChildren = children.length > 0
	const isGroup = node.type === 'group'

	return (
		<div>
			{/* biome-ignore lint/a11y/useSemanticElements: complex layout with nested buttons */}
			<div
				role='button'
				tabIndex={0}
				className={cn(
					'group/layer flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer transition-colors text-xs relative',
					isSelected
						? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
						: isMultiSelected
							? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
							: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400',
					node.locked && 'opacity-60',
					!node.visible && 'opacity-40',
				)}
				style={{ paddingLeft: `${depth * 16 + 8}px` }}
				onClick={handleClick}
				onContextMenu={handleContextMenu}
				onKeyDown={e => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault()
						selectNode(nodeId)
					}
				}}
			>
				{/* Expand toggle */}
				{hasChildren ? (
					<button
						type='button'
						onClick={e => {
							e.stopPropagation()
							toggleExpanded(nodeId)
						}}
						className='p-0.5'
					>
						<IconChevronRight
							className={cn(
								'h-3 w-3 transition-transform',
								isExpanded && 'rotate-90',
							)}
						/>
					</button>
				) : (
					<span className='w-4' />
				)}

				{/* Group icon */}
				{isGroup &&
					(isExpanded ? (
						<IconFolderOpen className='h-3 w-3 text-amber-500 shrink-0' />
					) : (
						<IconFolder className='h-3 w-3 text-amber-500 shrink-0' />
					))}

				<span className='flex-1 truncate font-medium'>
					{isGroup
						? String(node.props.label) || 'Group'
						: String(def?.label ?? node.type)}
				</span>

				{/* Status indicators */}
				{node.locked && <IconLock className='h-3 w-3 text-gray-400 shrink-0' />}
				{!node.visible && (
					<IconEyeOff className='h-3 w-3 text-gray-400 shrink-0' />
				)}

				{/* Quick actions (visible on hover) */}
				<div className='hidden group-hover/layer:flex items-center gap-0.5'>
					<button
						type='button'
						onClick={e => {
							e.stopPropagation()
							toggleNodeVisibility(nodeId)
						}}
						className='p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600'
						title={node.visible ? 'Hide' : 'Show'}
					>
						<IconEyeOff className='h-2.5 w-2.5' />
					</button>
					<button
						type='button'
						onClick={e => {
							e.stopPropagation()
							toggleNodeLock(nodeId)
						}}
						className='p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600'
						title={node.locked ? 'Unlock' : 'Lock'}
					>
						<IconLock className='h-2.5 w-2.5' />
					</button>
				</div>
			</div>

			{/* Context menu */}
			{showContextMenu && (
				<div className='absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 ml-8 min-w-[140px]'>
					<ContextMenuItem
						label={node.locked ? 'Unlock' : 'Lock'}
						onClick={() => toggleNodeLock(nodeId)}
					/>
					<ContextMenuItem
						label={node.visible ? 'Hide' : 'Show'}
						onClick={() => toggleNodeVisibility(nodeId)}
					/>
					{isGroup && (
						<ContextMenuItem
							label='Ungroup'
							onClick={() => ungroupNodes(nodeId)}
						/>
					)}
					<div className='h-px bg-gray-200 dark:bg-gray-700 my-1' />
					<ContextMenuItem
						label='Delete'
						onClick={() => removeNode(nodeId)}
						destructive
					/>
				</div>
			)}

			{/* Children */}
			{isExpanded &&
				children.map(child => (
					<LayerItem key={child.id} nodeId={child.id} depth={depth + 1} />
				))}
		</div>
	)
}

function ContextMenuItem({
	label,
	onClick,
	destructive,
}: {
	label: string
	onClick: () => void
	destructive?: boolean
}) {
	return (
		<button
			type='button'
			onClick={e => {
				e.stopPropagation()
				onClick()
			}}
			className={cn(
				'w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
				destructive
					? 'text-red-500 hover:text-red-600'
					: 'text-gray-700 dark:text-gray-300',
			)}
		>
			{label}
		</button>
	)
}
