'use client'

import {
	useSelectedNode,
	useCanvasStore,
	type StyleValue,
} from '../../stores/canvas-store'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { IconBorderAll, IconBorderCorners } from '@tabler/icons-react'

// ========================================
// Constants
// ========================================

const BORDER_STYLES = [
	{ value: 'solid', label: 'Solid' },
	{ value: 'dashed', label: 'Dashed' },
	{ value: 'dotted', label: 'Dotted' },
	{ value: 'none', label: 'None' },
] as const

const RADIUS_PRESETS = [0, 2, 4, 6, 8, 12, 16, 24, 999] as const

type Corner = 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft'

// ========================================
// Border Inspector
// ========================================

export function BorderInspector() {
	const node = useSelectedNode()
	const updateStyleValue = useCanvasStore(s => s.updateStyleValue)
	const [perCorner, setPerCorner] = useState(false)

	if (!node) {
		return (
			<div className='p-4 text-gray-500 dark:text-gray-400 text-sm text-center'>
				Select a component to edit borders
			</div>
		)
	}

	const base = node.styles?.base ?? {}

	const getVal = (prop: string): string => {
		const sv = base[prop as keyof typeof base] as StyleValue | undefined
		if (!sv) return ''
		return String(sv.value ?? '')
	}

	const getNumVal = (prop: string): number => {
		const v = getVal(prop)
		return v ? Number.parseFloat(v) || 0 : 0
	}

	const setValue = (property: string, value: string, unit = 'px') => {
		if (!value || value === '0') {
			updateStyleValue(node.id, 'base', property, null)
		} else {
			updateStyleValue(node.id, 'base', property, {
				type: 'static',
				value,
				unit,
			})
		}
	}

	const borderWidth = getNumVal('borderWidth')
	const borderColor = getVal('borderColor') || '#d1d5db'
	const borderStyle = getVal('borderStyle') || 'solid'
	const borderRadius = getNumVal('borderRadius')

	return (
		<div className='p-4 space-y-4'>
			<h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5'>
				<IconBorderAll className='h-3.5 w-3.5' />
				Border
			</h3>

			{/* Border Width */}
			<div className='space-y-1.5'>
				<label className='text-[10px] font-medium text-gray-500 uppercase tracking-wider'>
					Width
				</label>
				<div className='flex items-center gap-2'>
					<input
						type='range'
						min={0}
						max={10}
						step={1}
						value={borderWidth}
						onChange={e => setValue('borderWidth', e.target.value)}
						className='flex-1 h-1 accent-blue-500'
					/>
					<span className='text-[10px] text-gray-500 w-8 text-right font-mono'>
						{borderWidth}px
					</span>
				</div>
			</div>

			{/* Border Style */}
			<div className='space-y-1.5'>
				<label className='text-[10px] font-medium text-gray-500 uppercase tracking-wider'>
					Style
				</label>
				<div className='flex gap-1'>
					{BORDER_STYLES.map(bs => (
						<button
							key={bs.value}
							type='button'
							onClick={() => setValue('borderStyle', bs.value, '')}
							className={cn(
								'flex-1 px-2 py-1 text-[10px] rounded-md transition-colors',
								borderStyle === bs.value
									? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
									: 'bg-gray-100 text-gray-500 dark:bg-gray-800 hover:bg-gray-200',
							)}
						>
							{bs.label}
						</button>
					))}
				</div>
			</div>

			{/* Border Color */}
			<div className='space-y-1.5'>
				<label className='text-[10px] font-medium text-gray-500 uppercase tracking-wider'>
					Color
				</label>
				<div className='flex items-center gap-2'>
					<input
						type='color'
						value={borderColor}
						onChange={e => setValue('borderColor', e.target.value, '')}
						className='w-8 h-8 rounded border border-gray-200 dark:border-gray-700 cursor-pointer'
					/>
					<input
						type='text'
						value={borderColor}
						onChange={e => setValue('borderColor', e.target.value, '')}
						className='flex-1 px-2 py-1 text-[11px] border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 font-mono'
						placeholder='#d1d5db'
					/>
				</div>
			</div>

			{/* Divider */}
			<hr className='border-gray-200 dark:border-gray-700' />

			{/* Border Radius */}
			<div className='space-y-2'>
				<div className='flex items-center justify-between'>
					<label className='text-[10px] font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1'>
						<IconBorderCorners className='h-3 w-3' />
						Radius
					</label>
					<button
						type='button'
						onClick={() => setPerCorner(!perCorner)}
						className={cn(
							'px-1.5 py-0.5 text-[9px] rounded transition-colors',
							perCorner
								? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40'
								: 'bg-gray-100 text-gray-500 dark:bg-gray-800',
						)}
					>
						{perCorner ? 'Per Corner' : 'Uniform'}
					</button>
				</div>

				{!perCorner ? (
					<>
						{/* Uniform radius */}
						<div className='flex items-center gap-2'>
							<input
								type='range'
								min={0}
								max={48}
								step={1}
								value={borderRadius}
								onChange={e => setValue('borderRadius', e.target.value)}
								className='flex-1 h-1 accent-blue-500'
							/>
							<span className='text-[10px] text-gray-500 w-8 text-right font-mono'>
								{borderRadius}px
							</span>
						</div>
						{/* Preset buttons */}
						<div className='flex gap-1 flex-wrap'>
							{RADIUS_PRESETS.map(r => (
								<button
									key={r}
									type='button'
									onClick={() => setValue('borderRadius', String(r))}
									className={cn(
										'px-2 py-0.5 text-[10px] rounded transition-colors',
										borderRadius === r
											? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40'
											: 'bg-gray-100 text-gray-500 dark:bg-gray-800 hover:bg-gray-200',
									)}
								>
									{r === 999 ? 'Full' : `${r}`}
								</button>
							))}
						</div>
					</>
				) : (
					/* Per-corner radius */
					<div className='grid grid-cols-2 gap-2'>
						{(
							[
								['borderTopLeftRadius', 'TL'],
								['borderTopRightRadius', 'TR'],
								['borderBottomLeftRadius', 'BL'],
								['borderBottomRightRadius', 'BR'],
							] as const
						).map(([prop, label]) => (
							<div key={prop} className='flex items-center gap-1'>
								<span className='text-[9px] text-gray-400 w-5'>{label}</span>
								<input
									type='number'
									min={0}
									max={999}
									value={getNumVal(prop)}
									onChange={e => setValue(prop, e.target.value)}
									className='flex-1 px-2 py-1 text-[11px] border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
								/>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
