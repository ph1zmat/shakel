'use client'

import { useSelectedNode, useCanvasStore } from '../../stores/canvas-store'
import { getComponentDefinition } from '@/lib/codegen/component-registry'
import { ImageUploadPanel } from './image-upload-panel'
import { cn } from '@/lib/utils'

export function PropsInspector() {
	const node = useSelectedNode()
	const updateNodeProps = useCanvasStore(state => state.updateNodeProps)

	if (!node) {
		return (
			<div className='p-4 text-gray-500 dark:text-gray-400 text-sm text-center'>
				Select a component to edit properties
			</div>
		)
	}

	const def = getComponentDefinition(node.type)
	if (!def) return null

	return (
		<div className='p-4 space-y-4'>
			<h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
				{def.label} Properties
			</h3>

			{/* Image upload panel for image nodes */}
			{node.type === 'image' && <ImageUploadPanel />}

			{def.props.map(prop => (
				<div key={prop.name} className='space-y-1.5'>
					<span className='text-xs font-medium text-gray-600 dark:text-gray-400'>
						{prop.label}
					</span>

					{prop.type === 'string' && (
						<input
							type='text'
							value={(node.props[prop.name] as string) ?? ''}
							onChange={e =>
								updateNodeProps(node.id, { [prop.name]: e.target.value })
							}
							className='w-full px-2.5 py-1.5 text-sm border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					)}

					{prop.type === 'number' && (
						<input
							type='number'
							value={(node.props[prop.name] as number) ?? 0}
							onChange={e =>
								updateNodeProps(node.id, {
									[prop.name]: Number(e.target.value),
								})
							}
							className='w-full px-2.5 py-1.5 text-sm border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					)}

					{prop.type === 'boolean' && (
						<button
							type='button'
							onClick={() =>
								updateNodeProps(node.id, {
									[prop.name]: !node.props[prop.name],
								})
							}
							className={cn(
								'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
								node.props[prop.name]
									? 'bg-blue-500'
									: 'bg-gray-300 dark:bg-gray-600',
							)}
						>
							<span
								className={cn(
									'inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform',
									node.props[prop.name]
										? 'translate-x-[18px]'
										: 'translate-x-[3px]',
								)}
							/>
						</button>
					)}

					{prop.type === 'select' && prop.options && (
						<select
							value={(node.props[prop.name] as string) ?? ''}
							onChange={e =>
								updateNodeProps(node.id, { [prop.name]: e.target.value })
							}
							className='w-full px-2.5 py-1.5 text-sm border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
						>
							{prop.options.map(opt => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					)}

					{prop.type === 'json' && (
						<textarea
							value={
								typeof node.props[prop.name] === 'string'
									? (node.props[prop.name] as string)
									: JSON.stringify(node.props[prop.name] ?? {}, null, 2)
							}
							onChange={e => {
								try {
									const parsed = JSON.parse(e.target.value)
									updateNodeProps(node.id, { [prop.name]: parsed })
								} catch {
									// Keep raw string while user is typing
									updateNodeProps(node.id, { [prop.name]: e.target.value })
								}
							}}
							rows={4}
							className='w-full px-2.5 py-1.5 text-xs font-mono border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y'
						/>
					)}
				</div>
			))}
		</div>
	)
}
