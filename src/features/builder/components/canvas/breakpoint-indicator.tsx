'use client'

import type { CanvasViewport } from '../../utils/resolve-styles'
import { cn } from '@/lib/utils'

interface BreakpointIndicatorProps {
	viewport: CanvasViewport
	onViewportChange: (viewport: CanvasViewport) => void
}

const BREAKPOINTS = [
	{ name: 'mobile', label: 'Mobile', width: 375, value: 'mobile' as const },
	{ name: 'tablet', label: 'Tablet', width: 768, value: 'tablet' as const },
	{ name: 'desktop', label: 'Desktop', width: 1280, value: 'desktop' as const },
]

export function BreakpointIndicator({
	viewport,
	onViewportChange,
}: BreakpointIndicatorProps) {
	return (
		<div className='flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 dark:bg-gray-900/50 border-b'>
			<div className='flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400'>
				<span className='font-medium'>Breakpoints:</span>
			</div>
			<div className='flex items-center gap-1'>
				{BREAKPOINTS.map((bp, index) => (
					<div key={bp.name} className='flex items-center'>
						{index > 0 && (
							<div className='h-px w-8 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 mx-1' />
						)}
						<button
							type='button'
							onClick={() => onViewportChange(bp.value)}
							className={cn(
								'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all',
								viewport === bp.value
									? 'bg-blue-500 text-white shadow-md scale-105'
									: 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200',
							)}
						>
							<span className='text-xs font-semibold'>{bp.label}</span>
							<span className='text-[10px] opacity-70'>{bp.width}px</span>
						</button>
					</div>
				))}
			</div>
			<div className='flex items-center gap-2 ml-4 text-xs text-gray-500 dark:text-gray-400'>
				<div className='h-4 w-px bg-gray-200 dark:bg-gray-700' />
				<span>
					<span className='font-medium'>Current:</span> {viewport}
				</span>
			</div>
		</div>
	)
}
