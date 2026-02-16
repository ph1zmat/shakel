'use client'

import { useState } from 'react'
import {
	blockTemplates,
	templateCategories,
	type BlockTemplate,
} from '@/config/block-templates'
import { cn } from '@/lib/utils'
import { IconTemplate, IconSearch } from '@tabler/icons-react'

// ========================================
// Templates Palette — drag-and-drop block templates
// ========================================

export function TemplatesPalette() {
	const [category, setCategory] = useState('all')
	const [search, setSearch] = useState('')

	const filtered = blockTemplates.filter(t => {
		const matchCat = category === 'all' || t.category === category
		const matchSearch =
			!search ||
			t.name.toLowerCase().includes(search.toLowerCase()) ||
			t.description.toLowerCase().includes(search.toLowerCase())
		return matchCat && matchSearch
	})

	return (
		<div className='w-64 border-r bg-white dark:bg-gray-950 flex flex-col h-full'>
			{/* Header */}
			<div className='p-3 border-b space-y-2'>
				<div className='flex items-center gap-2'>
					<IconTemplate className='h-4 w-4 text-purple-500' />
					<h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
						Templates
					</h3>
				</div>

				{/* Search */}
				<div className='relative'>
					<IconSearch className='absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400' />
					<input
						type='text'
						placeholder='Search templates...'
						value={search}
						onChange={e => setSearch(e.target.value)}
						className='w-full pl-7 pr-2 py-1.5 text-xs border rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-700 outline-none focus:border-purple-300'
					/>
				</div>
			</div>

			{/* Category filter */}
			<div className='flex gap-1 p-2 flex-wrap border-b'>
				{templateCategories.map(cat => (
					<button
						key={cat.id}
						type='button'
						onClick={() => setCategory(cat.id)}
						className={cn(
							'px-2 py-0.5 text-[10px] rounded-full transition-colors',
							category === cat.id
								? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
								: 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800',
						)}
					>
						{cat.label}
					</button>
				))}
			</div>

			{/* Templates grid */}
			<div className='flex-1 overflow-y-auto p-2 space-y-2'>
				{filtered.length === 0 ? (
					<div className='text-center text-xs text-gray-400 py-8'>
						No templates found
					</div>
				) : (
					filtered.map(template => (
						<TemplateCard key={template.id} template={template} />
					))
				)}
			</div>
		</div>
	)
}

// ========================================
// Template Card — draggable template preview
// ========================================

function TemplateCard({ template }: { template: BlockTemplate }) {
	const handleDragStart = (e: React.DragEvent) => {
		e.dataTransfer.setData('application/x-template-id', template.id)
		e.dataTransfer.effectAllowed = 'copy'
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: drag source
		<div
			draggable
			onDragStart={handleDragStart}
			className='group rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden cursor-grab active:cursor-grabbing hover:border-purple-300 dark:hover:border-purple-700 transition-colors'
		>
			{/* Preview gradient */}
			<div
				className='h-20 relative'
				style={{
					background: `linear-gradient(135deg, ${template.previewColors[0]}, ${template.previewColors[1]})`,
				}}
			>
				{/* Mini preview of template layout */}
				<div className='absolute inset-2'>
					<TemplateMiniPreview template={template} />
				</div>
			</div>

			{/* Info */}
			<div className='p-2'>
				<div className='flex items-center gap-1.5'>
					<span className='text-sm'>{template.icon}</span>
					<span className='text-xs font-medium text-gray-700 dark:text-gray-300'>
						{template.name}
					</span>
				</div>
				<p className='text-[10px] text-gray-400 mt-0.5 line-clamp-2'>
					{template.description}
				</p>
			</div>
		</div>
	)
}

// ========================================
// Mini preview — shows simplified layout
// ========================================

function TemplateMiniPreview({ template }: { template: BlockTemplate }) {
	// Calculate bounds
	let maxX = 0
	let maxY = 0
	for (const n of template.nodes) {
		const right = n.offset.x + n.size.width
		const bottom = n.offset.y + n.size.height
		if (right > maxX) maxX = right
		if (bottom > maxY) maxY = bottom
	}

	const containerW = 240 - 16 // account for inset-2
	const containerH = 80 - 16
	const scale = Math.min(containerW / maxX, containerH / maxY, 1)

	return (
		<div className='relative w-full h-full'>
			{template.nodes.slice(0, 8).map(n => {
				const typeColors: Record<string, string> = {
					container: 'rgba(255,255,255,0.2)',
					text: 'rgba(255,255,255,0.5)',
					button: 'rgba(255,255,255,0.7)',
					input: 'rgba(255,255,255,0.3)',
					image: 'rgba(255,255,255,0.15)',
				}
				return (
					<div
						key={n.localId}
						className='absolute rounded-sm'
						style={{
							left: n.offset.x * scale,
							top: n.offset.y * scale,
							width: Math.max(n.size.width * scale, 2),
							height: Math.max(n.size.height * scale, 2),
							backgroundColor: typeColors[n.type] ?? 'rgba(255,255,255,0.3)',
						}}
					/>
				)
			})}
		</div>
	)
}
