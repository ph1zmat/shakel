'use client'

import { PropsInspector } from './props-inspector'
import { StyleInspector } from './style-inspector'
import { InteractionsInspector } from './interactions-inspector'
import { LayoutInspector } from './layout-inspector'
import { AnimationsInspector } from './animations-inspector'
import { BorderInspector } from './border-inspector'
import { ResponsiveEditor } from './responsive-editor'
import { useSelectedNode, useCanvasStore } from '../../stores/canvas-store'
import { getComponentDefinition } from '@/lib/codegen/component-registry'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { IconTrash } from '@tabler/icons-react'

type InspectorTab =
	| 'props'
	| 'styles'
	| 'border'
	| 'layout'
	| 'animate'
	| 'responsive'
	| 'interactions'

export function Inspector() {
	const node = useSelectedNode()
	const removeNode = useCanvasStore(state => state.removeNode)
	const [activeTab, setActiveTab] = useState<InspectorTab>('props')

	if (!node) {
		return (
			<div className='w-72 border-l bg-white dark:bg-gray-950 flex items-center justify-center'>
				<p className='text-sm text-gray-400 text-center px-6'>
					Select a component on the canvas to edit its properties
				</p>
			</div>
		)
	}

	const def = getComponentDefinition(node.type)

	return (
		<div className='w-72 border-l bg-white dark:bg-gray-950 overflow-y-auto flex flex-col'>
			{/* Header */}
			<div className='p-3 border-b flex items-center justify-between'>
				<div>
					<h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
						{def?.label ?? node.type}
					</h3>
					<p className='text-[10px] text-gray-400 font-mono'>{node.id}</p>
				</div>
				<div className='flex gap-1'>
					<button
						type='button'
						onClick={() => removeNode(node.id)}
						className='p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
						title='Delete component'
					>
						<IconTrash className='h-4 w-4' />
					</button>
				</div>
			</div>

			{/* Tabs */}
			<div className='flex border-b overflow-x-auto'>
				{(
					[
						'props',
						'styles',
						'border',
						'layout',
						'responsive',
						'animate',
						'interactions',
					] as const
				).map(tab => (
					<button
						key={tab}
						type='button'
						onClick={() => setActiveTab(tab)}
						className={cn(
							'flex-1 px-1.5 py-2 text-[10px] font-medium capitalize transition-colors border-b-2',
							activeTab === tab
								? 'border-blue-500 text-blue-600'
								: 'border-transparent text-gray-500 hover:text-gray-700',
						)}
					>
						{tab === 'responsive' ? 'RWD' : tab}
					</button>
				))}
			</div>

			{/* Content */}
			<div className='flex-1 overflow-y-auto'>
				{activeTab === 'props' && <PropsInspector />}
				{activeTab === 'styles' && <StyleInspector />}
				{activeTab === 'border' && <BorderInspector />}
				{activeTab === 'layout' && <LayoutInspector />}
				{activeTab === 'responsive' && <ResponsiveEditor />}
				{activeTab === 'animate' && <AnimationsInspector />}
				{activeTab === 'interactions' && <InteractionsInspector />}
			</div>
		</div>
	)
}
