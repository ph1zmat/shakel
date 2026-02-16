'use client'

import {
	componentCategories,
	getComponentsByPlatform,
	type ComponentDefinition,
} from '@/lib/codegen/component-registry'
import { useCanvasStore } from '../../stores/canvas-store'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import {
	IconSquare,
	IconGrid3x3,
	IconTypography,
	IconClick,
	IconLink,
	IconForms,
	IconPhoto,
	IconKeyboard,
	IconMessageCircle,
	IconLayoutGrid,
} from '@tabler/icons-react'

const iconMap: Record<string, React.ReactNode> = {
	Square: <IconSquare className='h-4 w-4' />,
	Grid3x3: <IconGrid3x3 className='h-4 w-4' />,
	Type: <IconTypography className='h-4 w-4' />,
	MousePointerClick: <IconClick className='h-4 w-4' />,
	Link: <IconLink className='h-4 w-4' />,
	TextCursorInput: <IconForms className='h-4 w-4' />,
	FormInput: <IconForms className='h-4 w-4' />,
	Image: <IconPhoto className='h-4 w-4' />,
	MessageSquare: <IconMessageCircle className='h-4 w-4' />,
	Keyboard: <IconKeyboard className='h-4 w-4' />,
	Layout: <IconLayoutGrid className='h-4 w-4' />,
	Database: <IconLayoutGrid className='h-4 w-4' />,
}

function getIcon(iconName: string) {
	return iconMap[iconName] || <IconSquare className='h-4 w-4' />
}

export function ComponentsPalette() {
	const platform = useCanvasStore(state => state.project?.platform)
	const [activeCategory, setActiveCategory] = useState<string>('all')

	const platformKey = platform === 'TELEGRAM_BOT' ? 'telegram' : 'web'
	const availableComponents = getComponentsByPlatform(platformKey)

	const filteredComponents =
		activeCategory === 'all'
			? availableComponents
			: availableComponents.filter(c => c.category === activeCategory)

	return (
		<div className='w-64 border-r bg-white dark:bg-gray-950 overflow-y-auto flex flex-col'>
			<div className='p-3 border-b'>
				<h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
					Components
				</h3>
			</div>

			{/* Category filter */}
			<div className='flex flex-wrap gap-1 p-2 border-b'>
				<CategoryButton
					label='All'
					isActive={activeCategory === 'all'}
					onClick={() => setActiveCategory('all')}
				/>
				{componentCategories.map(cat => (
					<CategoryButton
						key={cat.id}
						label={cat.label}
						isActive={activeCategory === cat.id}
						onClick={() => setActiveCategory(cat.id)}
					/>
				))}
			</div>

			{/* Component list */}
			<div className='flex-1 p-2 space-y-1'>
				{filteredComponents.map(comp => (
					<PaletteItem key={comp.type} component={comp} />
				))}

				{filteredComponents.length === 0 && (
					<div className='text-xs text-gray-400 text-center py-4'>
						No components in this category
					</div>
				)}
			</div>
		</div>
	)
}

function CategoryButton({
	label,
	isActive,
	onClick,
}: {
	label: string
	isActive: boolean
	onClick: () => void
}) {
	return (
		<button
			type='button'
			onClick={onClick}
			className={cn(
				'px-2 py-1 text-xs rounded-md transition-colors',
				isActive
					? 'bg-blue-500 text-white'
					: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200',
			)}
		>
			{label}
		</button>
	)
}

function PaletteItem({ component }: { component: ComponentDefinition }) {
	const [isDragging, setIsDragging] = useState(false)

	const handleDragStart = (e: React.DragEvent) => {
		e.dataTransfer.setData('application/x-component-type', component.type)
		e.dataTransfer.effectAllowed = 'copy'
		setIsDragging(true)
	}

	const handleDragEnd = () => {
		setIsDragging(false)
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: Draggable palette item
		<div
			draggable
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			className={cn(
				'flex items-center gap-2 px-3 py-2 rounded-md cursor-grab transition-colors',
				'hover:bg-gray-100 dark:hover:bg-gray-800 active:cursor-grabbing',
				isDragging && 'opacity-50',
			)}
		>
			<div className='text-gray-500'>{getIcon(component.icon)}</div>
			<div className='flex-1 min-w-0'>
				<div className='text-sm font-medium text-gray-700 dark:text-gray-300 truncate'>
					{component.label}
				</div>
				{component.description && (
					<div className='text-[10px] text-gray-400 truncate'>
						{component.description}
					</div>
				)}
			</div>
			{component.isContainer && (
				<span className='text-[9px] px-1 py-0.5 bg-blue-100 text-blue-600 rounded'>
					Container
				</span>
			)}
		</div>
	)
}
