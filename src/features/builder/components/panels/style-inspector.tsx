'use client'

import {
	useSelectedNode,
	useCanvasStore,
	type StyleValue,
} from '../../stores/canvas-store'
import { getComponentDefinition } from '@/lib/codegen/component-registry'
import { useDesignTokens } from '../../hooks/use-design-tokens'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type StyleState = 'base' | 'hover' | 'focus'

export function StyleInspector() {
	const node = useSelectedNode()
	const updateStyleValue = useCanvasStore(state => state.updateStyleValue)
	const [activeState, setActiveState] = useState<StyleState>('base')
	const { colors, spacing, typography, effects, isLoading } = useDesignTokens()

	if (!node) {
		return (
			<div className='p-4 text-gray-500 dark:text-gray-400 text-sm text-center'>
				Select a component to edit styles
			</div>
		)
	}

	const def = getComponentDefinition(node.type)
	if (!def) return null

	const currentStyles = node.styles[activeState] ?? {}

	return (
		<div className='p-4 space-y-4'>
			<h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
				Styles
			</h3>

			{/* State tabs */}
			<div className='flex gap-1'>
				{(['base', 'hover', 'focus'] as const).map(state => (
					<button
						key={state}
						type='button'
						onClick={() => setActiveState(state)}
						className={cn(
							'px-2 py-1 text-xs rounded-md capitalize transition-colors',
							activeState === state
								? 'bg-blue-500 text-white'
								: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200',
						)}
					>
						{state}
					</button>
				))}
			</div>

			{isLoading && (
				<p className='text-[10px] text-gray-400'>Loading tokens...</p>
			)}

			{/* Style properties */}
			<div className='space-y-3'>
				{def.styleProperties.map(sp => {
					const current = currentStyles[sp.name]
					return (
						<div key={sp.name} className='space-y-1.5'>
							<div className='flex items-center justify-between'>
								<span className='text-xs font-medium text-gray-600 dark:text-gray-400'>
									{sp.label}
								</span>
								{current && (
									<button
										type='button'
										onClick={() =>
											updateStyleValue(node.id, activeState, sp.name, null)
										}
										className='text-[10px] text-red-400 hover:text-red-600'
									>
										Reset
									</button>
								)}
							</div>

							<StyleValueEditor
								type={sp.type}
								value={current ?? null}
								onChange={value =>
									updateStyleValue(node.id, activeState, sp.name, value)
								}
								colors={colors}
								spacing={spacing}
								typography={typography}
								effects={effects}
							/>
						</div>
					)
				})}
			</div>

			{/* Responsive overrides */}
			<div className='border-t pt-3'>
				<h4 className='text-xs font-medium text-gray-500 mb-2'>
					Responsive Overrides
				</h4>
				<div className='flex gap-1'>
					{(['sm', 'md', 'lg'] as const).map(bp => {
						const hasOverrides =
							node.styles.responsive?.[bp] &&
							Object.keys(node.styles.responsive[bp] ?? {}).length > 0
						return (
							<span
								key={bp}
								className={cn(
									'px-2 py-1 text-xs rounded uppercase',
									hasOverrides
										? 'bg-green-100 text-green-700'
										: 'bg-gray-100 text-gray-400',
								)}
							>
								{bp}
							</span>
						)
					})}
				</div>
			</div>
		</div>
	)
}

// ========================================
// Token interfaces (from Prisma models)
// ========================================

interface ColorToken {
	id: string
	name: string
	hue: number
	saturation: number
	lightness: number
	alpha: number
	isSemantic: boolean
	semanticRole: string | null
}

interface SpacingToken {
	id: string
	name: string
	value: number
}

interface TypographyToken {
	id: string
	name: string
	family: string
	minSize: number
	maxSize: number
	lineHeight: number
}

interface EffectToken {
	id: string
	name: string
	type: string
	params: unknown
}

// ========================================
// StyleValueEditor — uses real design tokens
// ========================================

function StyleValueEditor({
	type,
	value,
	onChange,
	colors,
	spacing,
	typography,
	effects,
}: {
	type: string
	value: StyleValue | null
	onChange: (value: StyleValue) => void
	colors: ColorToken[]
	spacing: SpacingToken[]
	typography: TypographyToken[]
	effects: EffectToken[]
}) {
	const [mode, setMode] = useState<'token' | 'static'>(value?.type ?? 'token')

	switch (type) {
		case 'color':
			return (
				<div className='space-y-1'>
					<ModeToggle mode={mode} onChange={setMode} />
					{mode === 'token' ? (
						<div className='space-y-1.5'>
							{/* Color token grid */}
							{colors.length > 0 ? (
								<div className='grid grid-cols-6 gap-1'>
									{colors.map(c => {
										const hsl = `hsl(${c.hue}, ${c.saturation}%, ${c.lightness}%)`
										const isActive = value?.value === c.name
										return (
											<button
												key={c.id}
												type='button'
												onClick={() =>
													onChange({
														type: 'token',
														tokenType: 'color',
														value: c.name,
													})
												}
												className={cn(
													'w-full aspect-square rounded-md border-2 transition-all hover:scale-110',
													isActive
														? 'border-blue-500 ring-2 ring-blue-200'
														: 'border-transparent hover:border-gray-300',
												)}
												style={{ backgroundColor: hsl }}
												title={`${c.name}${c.semanticRole ? ` (${c.semanticRole})` : ''}`}
											/>
										)
									})}
								</div>
							) : (
								<p className='text-[10px] text-gray-400'>
									No color tokens defined
								</p>
							)}
							{/* Fallback select */}
							<select
								value={(value?.value as string) ?? ''}
								onChange={e =>
									onChange({
										type: 'token',
										tokenType: 'color',
										value: e.target.value,
									})
								}
								className='w-full px-2 py-1 text-[11px] border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700'
							>
								<option value=''>Select token...</option>
								{colors.map(c => (
									<option key={c.id} value={c.name}>
										{c.name}
										{c.semanticRole ? ` (${c.semanticRole})` : ''}
									</option>
								))}
							</select>
						</div>
					) : (
						<div className='flex gap-1.5 items-center'>
							<input
								type='color'
								value={(value?.value as string) ?? '#000000'}
								onChange={e =>
									onChange({ type: 'static', value: e.target.value })
								}
								className='w-8 h-8 rounded border cursor-pointer shrink-0'
							/>
							<input
								type='text'
								value={(value?.value as string) ?? '#000000'}
								onChange={e =>
									onChange({ type: 'static', value: e.target.value })
								}
								className='flex-1 px-2 py-1.5 text-xs border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 font-mono'
								placeholder='#000000'
							/>
						</div>
					)}
				</div>
			)

		case 'spacing':
			return (
				<div className='space-y-1'>
					<ModeToggle mode={mode} onChange={setMode} />
					{mode === 'token' ? (
						<div className='space-y-1.5'>
							{/* Spacing visual picker */}
							{spacing.length > 0 && (
								<div className='flex gap-1 flex-wrap'>
									{spacing.map(s => {
										const isActive = value?.value === s.name
										return (
											<button
												key={s.id}
												type='button'
												onClick={() =>
													onChange({
														type: 'token',
														tokenType: 'spacing',
														value: s.name,
													})
												}
												className={cn(
													'px-2 py-1 text-[10px] rounded border transition-colors',
													isActive
														? 'bg-blue-500 text-white border-blue-500'
														: 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-300',
												)}
												title={`${s.value}rem`}
											>
												{s.name}
											</button>
										)
									})}
								</div>
							)}
							<select
								value={(value?.value as string) ?? ''}
								onChange={e =>
									onChange({
										type: 'token',
										tokenType: 'spacing',
										value: e.target.value,
									})
								}
								className='w-full px-2 py-1 text-[11px] border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700'
							>
								<option value=''>Select token...</option>
								{spacing.map(s => (
									<option key={s.id} value={s.name}>
										{s.name} ({s.value}rem)
									</option>
								))}
							</select>
						</div>
					) : (
						<div className='flex gap-1'>
							<input
								type='number'
								value={(value?.value as number) ?? 0}
								onChange={e =>
									onChange({
										type: 'static',
										value: Number(e.target.value),
										unit: value?.unit ?? 'px',
									})
								}
								className='flex-1 px-2 py-1.5 text-xs border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700'
							/>
							<select
								value={value?.unit ?? 'px'}
								onChange={e =>
									onChange({
										type: 'static',
										value: value?.value ?? 0,
										unit: e.target.value,
									})
								}
								className='w-14 px-1 py-1.5 text-xs border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700'
							>
								<option value='px'>px</option>
								<option value='rem'>rem</option>
								<option value='%'>%</option>
							</select>
						</div>
					)}
				</div>
			)

		case 'dimension':
			return (
				<div className='flex gap-1'>
					<input
						type='number'
						value={(value?.value as number) ?? 0}
						onChange={e =>
							onChange({
								type: 'static',
								value: Number(e.target.value),
								unit: value?.unit ?? 'px',
							})
						}
						className='flex-1 px-2 py-1.5 text-xs border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700'
					/>
					<select
						value={value?.unit ?? 'px'}
						onChange={e =>
							onChange({
								type: 'static',
								value: value?.value ?? 0,
								unit: e.target.value,
							})
						}
						className='w-14 px-1 py-1.5 text-xs border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700'
					>
						<option value='px'>px</option>
						<option value='rem'>rem</option>
						<option value='%'>%</option>
					</select>
				</div>
			)

		case 'typography':
			return (
				<div className='space-y-1.5'>
					{typography.length > 0 ? (
						<div className='space-y-1'>
							{typography.map(t => {
								const isActive = value?.value === t.name
								return (
									<button
										key={t.id}
										type='button'
										onClick={() =>
											onChange({
												type: 'token',
												tokenType: 'typography',
												value: t.name,
											})
										}
										className={cn(
											'w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md border transition-colors text-left',
											isActive
												? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 text-blue-700'
												: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300',
										)}
									>
										<span style={{ fontFamily: t.family }}>{t.name}</span>
										<span className='text-[10px] text-gray-400'>
											{t.minSize}–{t.maxSize}rem
										</span>
									</button>
								)
							})}
						</div>
					) : (
						<select
							value={(value?.value as string) ?? ''}
							onChange={e =>
								onChange({
									type: 'token',
									tokenType: 'typography',
									value: e.target.value,
								})
							}
							className='w-full px-2 py-1.5 text-xs border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700'
						>
							<option value=''>Select token...</option>
							<option value='heading'>Heading</option>
							<option value='body'>Body</option>
							<option value='mono'>Monospace</option>
						</select>
					)}
				</div>
			)

		case 'effect':
			return (
				<div className='space-y-1.5'>
					{effects.length > 0 ? (
						<div className='space-y-1'>
							{effects.map(ef => {
								const isActive = value?.value === ef.name
								return (
									<button
										key={ef.id}
										type='button'
										onClick={() =>
											onChange({
												type: 'token',
												tokenType: 'effect',
												value: ef.name,
											})
										}
										className={cn(
											'w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md border transition-colors text-left',
											isActive
												? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 text-blue-700'
												: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300',
										)}
									>
										<span>{ef.name}</span>
										<span className='text-[10px] text-gray-400 uppercase'>
											{ef.type}
										</span>
									</button>
								)
							})}
						</div>
					) : (
						<select
							value={(value?.value as string) ?? ''}
							onChange={e =>
								onChange({
									type: 'token',
									tokenType: 'effect',
									value: e.target.value,
								})
							}
							className='w-full px-2 py-1.5 text-xs border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700'
						>
							<option value=''>None</option>
							<option value='shadow-sm'>Shadow SM</option>
							<option value='shadow-md'>Shadow MD</option>
							<option value='shadow-lg'>Shadow LG</option>
						</select>
					)}
				</div>
			)

		default:
			return null
	}
}

// ========================================
// Mode toggle (Token / Static)
// ========================================

function ModeToggle({
	mode,
	onChange,
}: {
	mode: 'token' | 'static'
	onChange: (mode: 'token' | 'static') => void
}) {
	return (
		<div className='flex bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden mb-1'>
			<button
				type='button'
				onClick={() => onChange('token')}
				className={cn(
					'px-2 py-0.5 text-[10px] transition-colors',
					mode === 'token'
						? 'bg-blue-500 text-white'
						: 'text-gray-500 hover:text-gray-700',
				)}
			>
				Token
			</button>
			<button
				type='button'
				onClick={() => onChange('static')}
				className={cn(
					'px-2 py-0.5 text-[10px] transition-colors',
					mode === 'static'
						? 'bg-blue-500 text-white'
						: 'text-gray-500 hover:text-gray-700',
				)}
			>
				Static
			</button>
		</div>
	)
}
