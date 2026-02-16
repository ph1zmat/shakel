'use client'

import type { ReactNode } from 'react'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'

interface WorkflowNodeProps {
	name: string
	description?: string
	onSettings?: () => void
	onDelete?: () => void
	children: ReactNode
}

export function WorkflowNode({
	name,
	description,
	onSettings,
	onDelete,
	children,
}: WorkflowNodeProps) {
	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>
				<div className='group relative' title={description ?? name}>
					{children}
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent>
				{onSettings && (
					<ContextMenuItem onClick={onSettings}>Settings</ContextMenuItem>
				)}
				{onDelete && (
					<ContextMenuItem onClick={onDelete} className='text-red-600'>
						Delete
					</ContextMenuItem>
				)}
			</ContextMenuContent>
		</ContextMenu>
	)
}
