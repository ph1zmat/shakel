'use client'

import {
	useSelectedNode,
	useCanvasStore,
	type AnimationConfig,
} from '../../stores/canvas-store'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { AnimationPreset, AnimationTrigger } from '@/types/builder'
import { IconPlayerPlay, IconPlus, IconTrash } from '@tabler/icons-react'

// ========================================
// Animation presets
// ========================================

const PRESET_OPTIONS: { value: AnimationPreset; label: string }[] = [
	{ value: 'fadeIn', label: 'Fade In' },
	{ value: 'fadeOut', label: 'Fade Out' },
	{ value: 'slideUp', label: 'Slide Up' },
	{ value: 'slideDown', label: 'Slide Down' },
	{ value: 'slideLeft', label: 'Slide Left' },
	{ value: 'slideRight', label: 'Slide Right' },
	{ value: 'scaleIn', label: 'Scale In' },
	{ value: 'scaleOut', label: 'Scale Out' },
	{ value: 'bounceIn', label: 'Bounce In' },
	{ value: 'rotateIn', label: 'Rotate In' },
	{ value: 'flipX', label: 'Flip X' },
	{ value: 'flipY', label: 'Flip Y' },
	{ value: 'pulse', label: 'Pulse' },
	{ value: 'shake', label: 'Shake' },
]

const TRIGGER_OPTIONS: { value: AnimationTrigger; label: string }[] = [
	{ value: 'onMount', label: 'On Mount' },
	{ value: 'onHover', label: 'On Hover' },
	{ value: 'onClick', label: 'On Click' },
	{ value: 'onScroll', label: 'On Scroll' },
]

const EASE_OPTIONS = [
	{ value: 'linear', label: 'Linear' },
	{ value: 'easeIn', label: 'Ease In' },
	{ value: 'easeOut', label: 'Ease Out' },
	{ value: 'easeInOut', label: 'Ease In Out' },
	{ value: 'spring', label: 'Spring' },
] as const

// ========================================
// Animations Inspector
// ========================================

export function AnimationsInspector() {
	const node = useSelectedNode()
	const updateNodeAnimations = useCanvasStore(s => s.updateNodeAnimations)

	if (!node) {
		return (
			<div className='p-4 text-gray-500 dark:text-gray-400 text-sm text-center'>
				Select a component to add animations
			</div>
		)
	}

	const animations = node.animations ?? []

	const addAnimation = () => {
		const newAnim: AnimationConfig = {
			id: Math.random().toString(36).substring(2, 10),
			trigger: 'onMount',
			preset: 'fadeIn',
			duration: 0.5,
			delay: 0,
			ease: 'easeOut',
			repeat: 0,
		}
		updateNodeAnimations(node.id, [...animations, newAnim])
	}

	const updateAnimation = (id: string, patch: Partial<AnimationConfig>) => {
		updateNodeAnimations(
			node.id,
			animations.map(a => (a.id === id ? { ...a, ...patch } : a)),
		)
	}

	const removeAnimation = (id: string) => {
		updateNodeAnimations(
			node.id,
			animations.filter(a => a.id !== id),
		)
	}

	return (
		<div className='p-4 space-y-3'>
			<div className='flex items-center justify-between'>
				<h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
					<IconPlayerPlay className='h-3.5 w-3.5 inline mr-1' />
					Animations
				</h3>
				<button
					type='button'
					onClick={addAnimation}
					className='flex items-center gap-1 px-2 py-1 text-[10px] rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
				>
					<IconPlus className='h-2.5 w-2.5' />
					Add
				</button>
			</div>

			{animations.length === 0 ? (
				<div className='space-y-3'>
					<p className='text-xs text-gray-400 text-center py-2'>
						No animations yet. Pick a preset or click Add.
					</p>
					{/* Preset quick-add grid */}
					<div className='space-y-1.5'>
						<h4 className='text-[10px] font-medium text-gray-400 uppercase tracking-wider'>
							Quick Add
						</h4>
						<div className='grid grid-cols-2 gap-1'>
							{PRESET_OPTIONS.slice(0, 8).map(preset => (
								<button
									key={preset.value}
									type='button'
									onClick={() => {
										const newAnim: AnimationConfig = {
											id: Math.random().toString(36).substring(2, 10),
											trigger: 'onMount',
											preset: preset.value,
											duration: 0.5,
											delay: 0,
											ease: 'easeOut',
											repeat: 0,
										}
										updateNodeAnimations(node.id, [...animations, newAnim])
									}}
									className='px-2 py-1.5 text-[10px] rounded-md border border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors text-gray-600 dark:text-gray-300'
								>
									{preset.label}
								</button>
							))}
						</div>
					</div>
				</div>
			) : (
				<div className='space-y-3'>
					{animations.map(anim => (
						<AnimationEditor
							key={anim.id}
							animation={anim}
							onUpdate={patch => updateAnimation(anim.id, patch)}
							onRemove={() => removeAnimation(anim.id)}
						/>
					))}
				</div>
			)}
		</div>
	)
}

// ========================================
// Animation Editor Card
// ========================================

function AnimationEditor({
	animation,
	onUpdate,
	onRemove,
}: {
	animation: AnimationConfig
	onUpdate: (patch: Partial<AnimationConfig>) => void
	onRemove: () => void
}) {
	const [expanded, setExpanded] = useState(true)
	const presetInfo = PRESET_OPTIONS.find(p => p.value === animation.preset)

	return (
		<div className='rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
			{/* Header */}
			<div className='flex items-center justify-between px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800'>
				<button
					type='button'
					onClick={() => setExpanded(!expanded)}
					className='flex items-center gap-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-300'
				>
					<span>{presetInfo?.label ?? animation.preset}</span>
					<span className='text-[9px] text-gray-400 px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded'>
						{animation.trigger}
					</span>
				</button>
				<button
					type='button'
					onClick={onRemove}
					className='p-0.5 rounded text-gray-400 hover:text-red-500'
				>
					<IconTrash className='h-3 w-3' />
				</button>
			</div>

			{expanded && (
				<div className='p-2.5 space-y-2'>
					{/* Preset */}
					<Row label='Effect'>
						<select
							value={animation.preset}
							onChange={e =>
								onUpdate({ preset: e.target.value as AnimationPreset })
							}
							className='flex-1 px-2 py-1 text-[11px] border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700'
						>
							{PRESET_OPTIONS.map(p => (
								<option key={p.value} value={p.value}>
									{p.label}
								</option>
							))}
						</select>
					</Row>

					{/* Trigger */}
					<Row label='Trigger'>
						<select
							value={animation.trigger}
							onChange={e =>
								onUpdate({ trigger: e.target.value as AnimationTrigger })
							}
							className='flex-1 px-2 py-1 text-[11px] border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700'
						>
							{TRIGGER_OPTIONS.map(t => (
								<option key={t.value} value={t.value}>
									{t.label}
								</option>
							))}
						</select>
					</Row>

					{/* Duration & Delay */}
					<div className='grid grid-cols-2 gap-2'>
						<Row label='Duration'>
							<input
								type='number'
								value={animation.duration}
								onChange={e =>
									onUpdate({ duration: Math.max(0, Number(e.target.value)) })
								}
								step={0.1}
								min={0}
								className='w-full px-2 py-1 text-[11px] border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
							/>
						</Row>
						<Row label='Delay'>
							<input
								type='number'
								value={animation.delay}
								onChange={e =>
									onUpdate({ delay: Math.max(0, Number(e.target.value)) })
								}
								step={0.1}
								min={0}
								className='w-full px-2 py-1 text-[11px] border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
							/>
						</Row>
					</div>

					{/* Ease */}
					<Row label='Easing'>
						<select
							value={animation.ease}
							onChange={e =>
								onUpdate({ ease: e.target.value as AnimationConfig['ease'] })
							}
							className='flex-1 px-2 py-1 text-[11px] border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700'
						>
							{EASE_OPTIONS.map(opt => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</Row>

					{/* Repeat */}
					<Row label='Repeat'>
						<div className='flex gap-1'>
							{[0, 1, 3, -1].map(val => (
								<button
									key={val}
									type='button'
									onClick={() => onUpdate({ repeat: val })}
									className={cn(
										'px-2 py-0.5 text-[10px] rounded transition-colors',
										animation.repeat === val
											? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40'
											: 'bg-gray-100 text-gray-500 dark:bg-gray-800 hover:bg-gray-200',
									)}
								>
									{val === -1 ? 'Inf' : val === 0 ? 'Once' : `${val}x`}
								</button>
							))}
						</div>
					</Row>
				</div>
			)}
		</div>
	)
}

function Row({
	label,
	children,
}: {
	label: string
	children: React.ReactNode
}) {
	return (
		<div className='flex items-center gap-2'>
			<span className='text-[10px] text-gray-400 w-14 shrink-0'>{label}</span>
			{children}
		</div>
	)
}
