'use client'

import {
	useSelectedNode,
	useCanvasStore,
	type StyleValue,
} from '../../stores/canvas-store'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import {
	IconDeviceMobile,
	IconDeviceTablet,
	IconDeviceDesktop,
	IconDeviceLaptop,
	IconScreenShare,
} from '@tabler/icons-react'

// ========================================
// Breakpoint definitions
// ========================================

const BREAKPOINTS = [
	{
		key: 'base',
		label: 'Base',
		icon: IconDeviceMobile,
		width: 'All',
		color: 'text-gray-500',
	},
	{
		key: 'sm',
		label: 'SM',
		icon: IconDeviceMobile,
		width: '640px',
		color: 'text-green-500',
	},
	{
		key: 'md',
		label: 'MD',
		icon: IconDeviceTablet,
		width: '768px',
		color: 'text-blue-500',
	},
	{
		key: 'lg',
		label: 'LG',
		icon: IconDeviceLaptop,
		width: '1024px',
		color: 'text-purple-500',
	},
	{
		key: 'xl',
		label: 'XL',
		icon: IconDeviceDesktop,
		width: '1280px',
		color: 'text-orange-500',
	},
	{
		key: '2xl',
		label: '2XL',
		icon: IconScreenShare,
		width: '1536px',
		color: 'text-red-500',
	},
] as const

type BreakpointKey = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

// Commonly overridden properties per breakpoint
const RESPONSIVE_PROPERTIES = [
	{ name: 'fontSize', label: 'Font Size', placeholder: '16px' },
	{ name: 'padding', label: 'Padding', placeholder: '16px' },
	{ name: 'margin', label: 'Margin', placeholder: '0px' },
	{ name: 'width', label: 'Width', placeholder: 'auto' },
	{ name: 'height', label: 'Height', placeholder: 'auto' },
	{ name: 'gap', label: 'Gap', placeholder: '0px' },
	{ name: 'flexDirection', label: 'Direction', placeholder: 'row' },
	{ name: 'display', label: 'Display', placeholder: 'flex' },
	{ name: 'textAlign', label: 'Text Align', placeholder: 'left' },
	{
		name: 'gridTemplateColumns',
		label: 'Grid Cols',
		placeholder: 'repeat(3, 1fr)',
	},
] as const

// ========================================
// Responsive Styles Editor
// ========================================

export function ResponsiveEditor() {
	const node = useSelectedNode()
	const updateStyleValue = useCanvasStore(s => s.updateStyleValue)
	const updateNodeStyles = useCanvasStore(s => s.updateNodeStyles)
	const [activeBreakpoint, setActiveBreakpoint] =
		useState<BreakpointKey>('base')

	if (!node) {
		return (
			<div className='p-4 text-gray-500 dark:text-gray-400 text-sm text-center'>
				Select a component to edit responsive styles
			</div>
		)
	}

	const styles = node.styles

	// Get styles for selected breakpoint
	const getStylesForBreakpoint = (
		bp: BreakpointKey,
	): Record<string, StyleValue> => {
		if (bp === 'base') return styles.base ?? {}
		return styles.responsive?.[bp] ?? {}
	}

	const currentStyles = getStylesForBreakpoint(activeBreakpoint)

	const setPropertyValue = (property: string, value: string) => {
		if (activeBreakpoint === 'base') {
			if (value) {
				updateStyleValue(node.id, 'base', property, { type: 'static', value })
			} else {
				updateStyleValue(node.id, 'base', property, null)
			}
		} else {
			// Update responsive styles
			const newResponsive = { ...(styles.responsive ?? {}) }
			const bpStyles = { ...(newResponsive[activeBreakpoint] ?? {}) }
			if (value) {
				bpStyles[property] = { type: 'static', value }
			} else {
				delete bpStyles[property]
			}

			// Clean empty breakpoints
			if (Object.keys(bpStyles).length === 0) {
				delete newResponsive[activeBreakpoint]
			} else {
				newResponsive[activeBreakpoint] = bpStyles
			}

			updateNodeStyles(node.id, {
				...styles,
				responsive:
					Object.keys(newResponsive).length > 0 ? newResponsive : undefined,
			})
		}
	}

	// Count overrides per breakpoint
	const countOverrides = (bp: BreakpointKey): number => {
		if (bp === 'base') return Object.keys(styles.base ?? {}).length
		return Object.keys(styles.responsive?.[bp] ?? {}).length
	}

	return (
		<div className='p-3 space-y-3'>
			{/* Breakpoint selector */}
			<div className='space-y-1'>
				<h4 className='text-[10px] font-medium text-gray-400 uppercase tracking-wider'>
					Breakpoint
				</h4>
				<div className='flex gap-0.5'>
					{BREAKPOINTS.map(bp => {
						const Icon = bp.icon
						const overrides = countOverrides(bp.key)
						return (
							<button
								key={bp.key}
								type='button'
								onClick={() => setActiveBreakpoint(bp.key)}
								className={cn(
									'relative flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-md text-[9px] transition-colors',
									activeBreakpoint === bp.key
										? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
										: 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800',
								)}
								title={`${bp.label} (${bp.width})`}
							>
								<Icon
									className={cn(
										'h-3.5 w-3.5',
										activeBreakpoint === bp.key ? '' : bp.color,
									)}
								/>
								<span className='font-medium'>{bp.label}</span>
								{overrides > 0 && bp.key !== 'base' && (
									<span className='absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-blue-500 text-white text-[7px] flex items-center justify-center'>
										{overrides}
									</span>
								)}
							</button>
						)
					})}
				</div>
			</div>

			{/* Active breakpoint info */}
			<div className='text-[10px] text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-md px-2 py-1'>
				{activeBreakpoint === 'base'
					? 'Base styles apply to all screen sizes'
					: `Overrides for screens >= ${BREAKPOINTS.find(b => b.key === activeBreakpoint)?.width}`}
			</div>

			{/* Property editors */}
			<div className='space-y-1.5'>
				{RESPONSIVE_PROPERTIES.map(prop => {
					const current = currentStyles[prop.name]
					const baseValue = styles.base?.[prop.name]
					const isOverridden = activeBreakpoint !== 'base' && current != null

					return (
						<div key={prop.name} className='flex items-center gap-2'>
							<span
								className={cn(
									'text-[10px] w-16 shrink-0',
									isOverridden ? 'text-blue-500 font-medium' : 'text-gray-400',
								)}
							>
								{prop.label}
							</span>
							<input
								type='text'
								value={current?.value != null ? String(current.value) : ''}
								onChange={e => setPropertyValue(prop.name, e.target.value)}
								placeholder={
									activeBreakpoint !== 'base' && baseValue
										? `(${String(baseValue.value)})`
										: prop.placeholder
								}
								className={cn(
									'flex-1 px-2 py-1 text-[11px] border rounded-md outline-none',
									isOverridden
										? 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
										: 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700',
								)}
							/>
							{isOverridden && (
								<button
									type='button'
									onClick={() => setPropertyValue(prop.name, '')}
									className='text-[9px] text-red-400 hover:text-red-600'
									title='Remove override'
								>
									x
								</button>
							)}
						</div>
					)
				})}
			</div>

			{/* Summary */}
			{styles.responsive && Object.keys(styles.responsive).length > 0 && (
				<div className='space-y-1'>
					<h4 className='text-[10px] font-medium text-gray-400 uppercase tracking-wider'>
						Overrides Summary
					</h4>
					<div className='flex flex-wrap gap-1'>
						{Object.entries(styles.responsive).map(([bp, bpStyles]) => (
							<span
								key={bp}
								className='px-1.5 py-0.5 text-[9px] rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
							>
								{bp}:{' '}
								{Object.keys(bpStyles as Record<string, StyleValue>).length}{' '}
								props
							</span>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
