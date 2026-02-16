'use client'

import {
	useSelectedNode,
	useCanvasStore,
	type EffectConfig,
} from '../../stores/canvas-store'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import {
	IconRotate,
	IconStack2,
	IconLock,
	IconLockOpen,
	IconEye,
	IconEyeOff,
	IconDroplet,
	IconShadow,
	IconPlus,
	IconTrash,
} from '@tabler/icons-react'

// ========================================
// Layout Inspector — Position, Size, Transform, Effects
// ========================================

export function LayoutInspector() {
	const node = useSelectedNode()
	const updateNodePosition = useCanvasStore(s => s.updateNodePosition)
	const updateNodeSize = useCanvasStore(s => s.updateNodeSize)
	const updateNodeRotation = useCanvasStore(s => s.updateNodeRotation)
	const updateNodeZIndex = useCanvasStore(s => s.updateNodeZIndex)
	const updateNodeOpacity = useCanvasStore(s => s.updateNodeOpacity)
	const toggleNodeLock = useCanvasStore(s => s.toggleNodeLock)
	const toggleNodeVisibility = useCanvasStore(s => s.toggleNodeVisibility)
	const updateNodeEffects = useCanvasStore(s => s.updateNodeEffects)

	if (!node) {
		return (
			<div className='p-4 text-gray-500 dark:text-gray-400 text-sm text-center'>
				Select a component to edit layout
			</div>
		)
	}

	return (
		<div className='p-4 space-y-4'>
			{/* Lock & Visibility row */}
			<div className='flex items-center justify-between'>
				<h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
					Layout
				</h3>
				<div className='flex gap-1'>
					<button
						type='button'
						onClick={() => toggleNodeLock(node.id)}
						className={cn(
							'p-1.5 rounded-md text-xs transition-colors',
							node.locked
								? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30'
								: 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
						)}
						title={node.locked ? 'Unlock' : 'Lock'}
					>
						{node.locked ? (
							<IconLock className='h-3.5 w-3.5' />
						) : (
							<IconLockOpen className='h-3.5 w-3.5' />
						)}
					</button>
					<button
						type='button'
						onClick={() => toggleNodeVisibility(node.id)}
						className={cn(
							'p-1.5 rounded-md text-xs transition-colors',
							!node.visible
								? 'bg-gray-200 text-gray-500 dark:bg-gray-700'
								: 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
						)}
						title={node.visible ? 'Hide' : 'Show'}
					>
						{node.visible ? (
							<IconEye className='h-3.5 w-3.5' />
						) : (
							<IconEyeOff className='h-3.5 w-3.5' />
						)}
					</button>
				</div>
			</div>

			{/* Position */}
			<Section title='Position'>
				<div className='grid grid-cols-2 gap-2'>
					<NumberField
						label='X'
						value={node.position.x}
						onChange={v =>
							updateNodePosition(node.id, { ...node.position, x: v })
						}
					/>
					<NumberField
						label='Y'
						value={node.position.y}
						onChange={v =>
							updateNodePosition(node.id, { ...node.position, y: v })
						}
					/>
				</div>
			</Section>

			{/* Size */}
			<Section title='Size'>
				<div className='grid grid-cols-2 gap-2'>
					<NumberField
						label='W'
						value={node.size.width}
						onChange={v =>
							updateNodeSize(node.id, { ...node.size, width: Math.max(1, v) })
						}
						min={1}
					/>
					<NumberField
						label='H'
						value={node.size.height}
						onChange={v =>
							updateNodeSize(node.id, { ...node.size, height: Math.max(1, v) })
						}
						min={1}
					/>
				</div>
			</Section>

			{/* Transform: Rotation */}
			<Section title='Transform'>
				<div className='grid grid-cols-2 gap-2'>
					<NumberField
						label={<IconRotate className='h-3 w-3' />}
						value={node.rotation}
						onChange={v => updateNodeRotation(node.id, v)}
						suffix='°'
					/>
					<NumberField
						label={<IconStack2 className='h-3 w-3' />}
						value={node.zIndex}
						onChange={v => updateNodeZIndex(node.id, v)}
					/>
				</div>
			</Section>

			{/* Opacity */}
			<Section title='Opacity'>
				<div className='flex items-center gap-2'>
					<IconDroplet className='h-3 w-3 text-gray-400 shrink-0' />
					<input
						type='range'
						min={0}
						max={100}
						value={Math.round(node.opacity * 100)}
						onChange={e =>
							updateNodeOpacity(node.id, Number(e.target.value) / 100)
						}
						className='flex-1 h-1.5 accent-blue-500'
					/>
					<span className='text-[11px] text-gray-500 w-8 text-right font-mono'>
						{Math.round(node.opacity * 100)}%
					</span>
				</div>
			</Section>

			{/* Constraints */}
			<Section title='Constraints'>
				<ConstraintsEditor nodeId={node.id} constraints={node.constraints} />
			</Section>

			{/* Effects */}
			<Section title='Effects'>
				<EffectsEditor
					effects={node.effects}
					onChange={effects => updateNodeEffects(node.id, effects)}
				/>
			</Section>
		</div>
	)
}

// ========================================
// Section wrapper
// ========================================

function Section({
	title,
	children,
}: {
	title: string
	children: React.ReactNode
}) {
	return (
		<div className='space-y-1.5'>
			<h4 className='text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
				{title}
			</h4>
			{children}
		</div>
	)
}

// ========================================
// NumberField — compact input with label
// ========================================

function NumberField({
	label,
	value,
	onChange,
	min,
	max,
	step = 1,
	suffix,
}: {
	label: React.ReactNode
	value: number
	onChange: (v: number) => void
	min?: number
	max?: number
	step?: number
	suffix?: string
}) {
	return (
		<div className='flex items-center gap-1 bg-gray-50 dark:bg-gray-900 rounded-md px-2 py-1 border border-gray-200 dark:border-gray-700'>
			<span className='text-[10px] text-gray-400 shrink-0'>{label}</span>
			<input
				type='number'
				value={Math.round(value)}
				onChange={e => onChange(Number(e.target.value))}
				min={min}
				max={max}
				step={step}
				className='flex-1 bg-transparent text-xs text-right outline-none w-12 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
			/>
			{suffix && <span className='text-[10px] text-gray-400'>{suffix}</span>}
		</div>
	)
}

// ========================================
// Constraints Editor (Figma-like)
// ========================================

function ConstraintsEditor({
	nodeId,
	constraints,
}: {
	nodeId: string
	constraints: { horizontal: string; vertical: string }
}) {
	const selectNodes = useCanvasStore(s => s.selectNodes)

	// We update constraints by patching the node directly via store
	// For now, use a simple approach
	const updateConstraints = (h: string, v: string) => {
		// Update through store action
		useCanvasStore.setState(state => {
			if (state.nodes[nodeId]) {
				state.nodes[nodeId].constraints = {
					horizontal: h as 'left' | 'right' | 'center' | 'stretch' | 'scale',
					vertical: v as 'top' | 'bottom' | 'center' | 'stretch' | 'scale',
				}
			}
		})
		// Re-select to trigger re-render
		selectNodes([nodeId])
	}

	const hOptions = ['left', 'right', 'center', 'stretch', 'scale']
	const vOptions = ['top', 'bottom', 'center', 'stretch', 'scale']

	return (
		<div className='grid grid-cols-2 gap-2'>
			<div className='space-y-1'>
				<span className='text-[10px] text-gray-400'>Horizontal</span>
				<select
					value={constraints.horizontal}
					onChange={e =>
						updateConstraints(e.target.value, constraints.vertical)
					}
					className='w-full px-2 py-1 text-[11px] border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700'
				>
					{hOptions.map(o => (
						<option key={o} value={o}>
							{o}
						</option>
					))}
				</select>
			</div>
			<div className='space-y-1'>
				<span className='text-[10px] text-gray-400'>Vertical</span>
				<select
					value={constraints.vertical}
					onChange={e =>
						updateConstraints(constraints.horizontal, e.target.value)
					}
					className='w-full px-2 py-1 text-[11px] border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700'
				>
					{vOptions.map(o => (
						<option key={o} value={o}>
							{o}
						</option>
					))}
				</select>
			</div>
		</div>
	)
}

// ========================================
// Effects Editor (shadows, blurs)
// ========================================

function generateId() {
	return Math.random().toString(36).substring(2, 10)
}

function EffectsEditor({
	effects,
	onChange,
}: {
	effects: EffectConfig[]
	onChange: (effects: EffectConfig[]) => void
}) {
	const [expanded, setExpanded] = useState<string | null>(null)

	const addEffect = (type: EffectConfig['type']) => {
		const newEffect: EffectConfig = {
			id: generateId(),
			type,
			visible: true,
			offsetX: type === 'dropShadow' || type === 'innerShadow' ? 0 : undefined,
			offsetY: type === 'dropShadow' || type === 'innerShadow' ? 4 : undefined,
			blur: type === 'dropShadow' || type === 'innerShadow' ? 8 : undefined,
			spread: type === 'dropShadow' || type === 'innerShadow' ? 0 : undefined,
			color:
				type === 'dropShadow' || type === 'innerShadow'
					? 'rgba(0,0,0,0.15)'
					: undefined,
			blurAmount:
				type === 'layerBlur' || type === 'backgroundBlur' ? 4 : undefined,
		}
		onChange([...effects, newEffect])
		setExpanded(newEffect.id)
	}

	const updateEffect = (id: string, patch: Partial<EffectConfig>) => {
		onChange(effects.map(e => (e.id === id ? { ...e, ...patch } : e)))
	}

	const removeEffect = (id: string) => {
		onChange(effects.filter(e => e.id !== id))
	}

	return (
		<div className='space-y-2'>
			{effects.map(ef => (
				<div
					key={ef.id}
					className='rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden'
				>
					{/* Effect header */}
					<div className='flex items-center justify-between px-2 py-1.5 bg-gray-50 dark:bg-gray-800'>
						<button
							type='button'
							onClick={() => setExpanded(expanded === ef.id ? null : ef.id)}
							className='flex-1 text-left text-[11px] font-medium text-gray-600 dark:text-gray-300'
						>
							<IconShadow className='h-3 w-3 inline mr-1' />
							{ef.type}
						</button>
						<div className='flex gap-0.5'>
							<button
								type='button'
								onClick={() => updateEffect(ef.id, { visible: !ef.visible })}
								className={cn(
									'p-0.5 rounded',
									ef.visible ? 'text-gray-400' : 'text-gray-300',
								)}
							>
								{ef.visible ? (
									<IconEye className='h-3 w-3' />
								) : (
									<IconEyeOff className='h-3 w-3' />
								)}
							</button>
							<button
								type='button'
								onClick={() => removeEffect(ef.id)}
								className='p-0.5 rounded text-gray-400 hover:text-red-500'
							>
								<IconTrash className='h-3 w-3' />
							</button>
						</div>
					</div>

					{/* Effect details */}
					{expanded === ef.id && (
						<div className='p-2 space-y-2'>
							{(ef.type === 'dropShadow' || ef.type === 'innerShadow') && (
								<>
									<div className='grid grid-cols-2 gap-1.5'>
										<NumberField
											label='X'
											value={ef.offsetX ?? 0}
											onChange={v => updateEffect(ef.id, { offsetX: v })}
										/>
										<NumberField
											label='Y'
											value={ef.offsetY ?? 0}
											onChange={v => updateEffect(ef.id, { offsetY: v })}
										/>
										<NumberField
											label='Blur'
											value={ef.blur ?? 0}
											onChange={v =>
												updateEffect(ef.id, { blur: Math.max(0, v) })
											}
											min={0}
										/>
										<NumberField
											label='Spread'
											value={ef.spread ?? 0}
											onChange={v => updateEffect(ef.id, { spread: v })}
										/>
									</div>
									<div className='flex items-center gap-1.5'>
										<span className='text-[10px] text-gray-400'>Color</span>
										<input
											type='text'
											value={ef.color ?? 'rgba(0,0,0,0.15)'}
											onChange={e =>
												updateEffect(ef.id, { color: e.target.value })
											}
											className='flex-1 px-2 py-1 text-[11px] border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 font-mono'
										/>
									</div>
								</>
							)}
							{(ef.type === 'layerBlur' || ef.type === 'backgroundBlur') && (
								<NumberField
									label='Amount'
									value={ef.blurAmount ?? 4}
									onChange={v =>
										updateEffect(ef.id, { blurAmount: Math.max(0, v) })
									}
									min={0}
									suffix='px'
								/>
							)}
						</div>
					)}
				</div>
			))}

			{/* Add effect button */}
			<div className='flex gap-1 flex-wrap'>
				<button
					type='button'
					onClick={() => addEffect('dropShadow')}
					className='flex items-center gap-1 px-2 py-1 text-[10px] rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
				>
					<IconPlus className='h-2.5 w-2.5' />
					Shadow
				</button>
				<button
					type='button'
					onClick={() => addEffect('innerShadow')}
					className='flex items-center gap-1 px-2 py-1 text-[10px] rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
				>
					<IconPlus className='h-2.5 w-2.5' />
					Inner
				</button>
				<button
					type='button'
					onClick={() => addEffect('layerBlur')}
					className='flex items-center gap-1 px-2 py-1 text-[10px] rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
				>
					<IconPlus className='h-2.5 w-2.5' />
					Blur
				</button>
			</div>
		</div>
	)
}
