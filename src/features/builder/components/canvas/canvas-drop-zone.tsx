'use client'

import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'

interface CanvasDropZoneProps {
	parentId: string | null
	index: number
}

export function CanvasDropZone({ parentId, index }: CanvasDropZoneProps) {
	const { isOver, setNodeRef } = useDroppable({
		id: `dropzone-${parentId ?? 'root'}-${index}`,
		data: {
			type: 'drop-zone',
			parentId,
			index,
		},
	})

	return (
		<div
			ref={setNodeRef}
			className={cn(
				'border-2 border-dashed rounded-lg transition-colors flex items-center justify-center min-h-[60px]',
				isOver
					? 'border-blue-500 bg-blue-50 text-blue-500'
					: 'border-gray-300 text-gray-400',
			)}
		>
			<span className='text-xs font-medium'>
				{isOver ? 'Drop here' : 'Drag component here'}
			</span>
		</div>
	)
}
