'use client'

import { useCallback, useRef, useState, useMemo, type MouseEvent } from 'react'
import { motion, type Transition, type TargetAndTransition } from 'motion/react'
import { useCanvasStore, type ComponentNode } from '../../stores/canvas-store'
import { getComponentDefinition } from '@/lib/codegen/component-registry'
import { resolveStyleConfig, resolveEffects } from '../../utils/resolve-styles'
import { useCanvasViewport } from './builder-canvas'
import { calculateSnap } from './smart-guides'
import { ResizeHandles } from './resize-handles'
import { cn } from '@/lib/utils'
import type { AnimationConfig } from '@/types/builder'
import { IconLock, IconEyeOff } from '@tabler/icons-react'

// ========================================
// CanvasNode — Free-only (absolute) mode
// ========================================

interface CanvasNodeProps {
	nodeId: string
	isSelected: boolean
	onSelect: () => void
}

// Node types that can expand vertically with content
const CONTAINER_TYPES = new Set(['container', 'card', 'form', 'group', 'grid', 'tabs'])

export function CanvasNode({ nodeId, isSelected, onSelect }: CanvasNodeProps) {
	const node = useCanvasStore(state => state.nodes[nodeId])
	const selectedNodeIds = useCanvasStore(state => state.selectedNodeIds)
	const selectNodes = useCanvasStore(state => state.selectNodes)
	const updateNodePosition = useCanvasStore(state => state.updateNodePosition)
	const moveSelectedNodes = useCanvasStore(state => state.moveSelectedNodes)
	const updateNodeSize = useCanvasStore(state => state.updateNodeSize)
	const updateNodeRotation = useCanvasStore(state => state.updateNodeRotation)
	const getChildNodes = useCanvasStore(state => state.getChildNodes)
	const startDrag = useCanvasStore(state => state.startDrag)
	const endDrag = useCanvasStore(state => state.endDrag)
	const setSnapGuides = useCanvasStore(state => state.setSnapGuides)
	const zoom = useCanvasStore(state => state.zoom)

	// Viewport scale for responsive preview
	const { scale: vpScale } = useCanvasViewport()

	const nodeRef = useRef<HTMLDivElement>(null)
	const [isDragging, setIsDragging] = useState(false)
	const dragStartRef = useRef<{
		mouseX: number
		mouseY: number
		nodeX: number
		nodeY: number
	} | null>(null)

	// ---- Resize Logic (must be before early returns) ----
	const handleResize = useCallback(
		(
			size: { width: number; height: number },
			positionDelta?: { dx: number; dy: number },
		) => {
			if (!node) return
			updateNodeSize(nodeId, size)
			if (positionDelta) {
				updateNodePosition(nodeId, {
					x: node.position.x + positionDelta.dx,
					y: node.position.y + positionDelta.dy,
				})
			}
		},
		[nodeId, node, updateNodeSize, updateNodePosition],
	)

	const handleRotate = useCallback(
		(rotation: number) => {
			updateNodeRotation(nodeId, rotation)
		},
		[nodeId, updateNodeRotation],
	)

	if (!node) return null
	if (!node.visible) {
		return (
			<div
				className='absolute pointer-events-none'
				style={{
					left: node.position.x,
					top: node.position.y,
					width: node.size.width,
					height: node.size.height,
					opacity: 0.2,
					border: '1px dashed #999',
				}}
			>
				<div className='absolute top-1 right-1'>
					<IconEyeOff className='h-3 w-3 text-gray-400' />
				</div>
			</div>
		)
	}

	const isMultiSelected = selectedNodeIds.includes(nodeId)
	const def = getComponentDefinition(node.type)
	const children = getChildNodes(nodeId)

	// ---- Drag Logic ----
	const handleMouseDown = (e: MouseEvent) => {
		if (node.locked) return
		if (e.button !== 0) return

		// Shift+click for multi-select
		if (e.shiftKey) {
			e.stopPropagation()
			const newIds = isMultiSelected
				? selectedNodeIds.filter(id => id !== nodeId)
				: [...selectedNodeIds, nodeId]
			selectNodes(newIds)
			return
		}

		e.stopPropagation()

		// If this node is part of a multi-selection, keep the selection; otherwise single-select
		const isPartOfMultiSelection = isMultiSelected && selectedNodeIds.length > 1
		if (!isPartOfMultiSelection) {
			onSelect()
		}

		const startX = e.clientX
		const startY = e.clientY
		const nodeX = node.position.x
		const nodeY = node.position.y

		dragStartRef.current = { mouseX: startX, mouseY: startY, nodeX, nodeY }
		setIsDragging(true)

		startDrag({
			nodeId,
			sourceParentId: node.parentId,
			sourceIndex: node.order,
		})

		let lastDx = 0
		let lastDy = 0

		const totalScale = zoom * vpScale

		const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
			if (!dragStartRef.current) return
			const dx = (moveEvent.clientX - dragStartRef.current.mouseX) / totalScale
			const dy = (moveEvent.clientY - dragStartRef.current.mouseY) / totalScale

			if (isPartOfMultiSelection) {
				// Move all selected nodes by the delta difference
				const ddx = dx - lastDx
				const ddy = dy - lastDy
				lastDx = dx
				lastDy = dy
				moveSelectedNodes(ddx, ddy)
				setSnapGuides([])
			} else {
				const rawX = Math.max(0, Math.round(dragStartRef.current.nodeX + dx))
				const rawY = Math.max(0, Math.round(dragStartRef.current.nodeY + dy))

				// Smart snapping
				const { nodes: allNodes, currentPageId } = useCanvasStore.getState()
				const snapResult = calculateSnap(
					nodeId,
					rawX,
					rawY,
					node.size.width,
					node.size.height,
					allNodes,
					currentPageId,
				)

				updateNodePosition(nodeId, {
					x: snapResult.x,
					y: snapResult.y,
				})
				setSnapGuides(snapResult.guides)
			}
		}

		const handleMouseUp = () => {
			dragStartRef.current = null
			setIsDragging(false)
			endDrag()
			setSnapGuides([])
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}

		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
	}

	const isContainerType = CONTAINER_TYPES.has(node.type)

	// ---- Render ----
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: Canvas node drag
		<div
			ref={nodeRef}
			className={cn(
				'absolute group',
				isDragging && 'opacity-80 cursor-grabbing',
				!isDragging && !node.locked && 'cursor-grab',
				node.locked && 'cursor-default',
			)}
			style={{
				left: node.position.x,
				top: node.position.y,
				width: node.size.width,
				height: isContainerType ? 'auto' : node.size.height,
				minHeight: isContainerType ? node.size.height : undefined,
				zIndex: node.zIndex,
				opacity: node.opacity,
				transform:
					node.rotation !== 0 ? `rotate(${node.rotation}deg)` : undefined,
			}}
			onMouseDown={handleMouseDown}
			data-node-id={nodeId}
		>
			{/* Selection / hover border */}
			<div
				className={cn(
					'absolute inset-0 rounded-md pointer-events-none transition-all duration-100',
					isSelected
						? 'ring-2 ring-blue-500 ring-offset-1'
						: isMultiSelected
							? 'ring-2 ring-blue-400 ring-offset-1'
							: 'ring-0 group-hover:ring-1 group-hover:ring-blue-300',
				)}
			/>

			{/* Locked indicator */}
			{node.locked && (
				<div className='absolute -top-5 left-0 flex items-center gap-1 text-[10px] text-orange-500 bg-orange-50 dark:bg-orange-950 px-1.5 py-0.5 rounded'>
					<IconLock className='h-2.5 w-2.5' />
					Locked
				</div>
			)}

			{/* Component type label on hover */}
			<div className='absolute -top-5 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gray-500 bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded shadow-sm border'>
				{def?.label || node.type}
			</div>

			{/* Component content — with animation preview */}
			<AnimatedWrapper animations={node.animations}>
				<div className={cn('w-full rounded-md', isContainerType ? 'min-h-full' : 'h-full overflow-hidden')}>
					<ComponentPreview node={node} childNodes={children} />
				</div>
			</AnimatedWrapper>

			{/* Resize handles (only when selected and not locked) */}
			{(isSelected || isMultiSelected) && !node.locked && (
				<ResizeHandles
					nodeId={nodeId}
					width={node.size.width}
					height={node.size.height}
					rotation={node.rotation}
					canvasScale={zoom * vpScale}
					onResize={handleResize}
					onRotate={handleRotate}
				/>
			)}
		</div>
	)
}

// ========================================
// AnimatedWrapper — applies motion animations from AnimationConfig
// ========================================

function AnimatedWrapper({
	animations,
	children,
}: {
	animations: AnimationConfig[]
	children: React.ReactNode
}) {
	const mountAnims = animations.filter(a => a.trigger === 'onMount')
	const hoverAnims = animations.filter(a => a.trigger === 'onHover')

	const motionProps = useMemo(() => {
		const props: Record<string, unknown> = {}

		// onMount animations → initial + animate
		if (mountAnims.length > 0) {
			const anim = mountAnims[0]
			const { from, to } = presetToKeyframes(anim.preset)
			props.initial = from
			props.animate = to
			props.transition = buildTransition(anim)
		}

		// onHover animations → whileHover
		if (hoverAnims.length > 0) {
			const anim = hoverAnims[0]
			const { to } = presetToKeyframes(anim.preset)
			props.whileHover = to
			if (!props.transition) {
				props.transition = buildTransition(anim)
			}
		}

		return props
	}, [mountAnims, hoverAnims])

	if (animations.length === 0) {
		return <>{children}</>
	}

	return (
		<motion.div className='w-full h-full' {...motionProps}>
			{children}
		</motion.div>
	)
}

function presetToKeyframes(preset: string): {
	from: TargetAndTransition
	to: TargetAndTransition
} {
	switch (preset) {
		case 'fadeIn':
			return { from: { opacity: 0 }, to: { opacity: 1 } }
		case 'fadeOut':
			return { from: { opacity: 1 }, to: { opacity: 0 } }
		case 'slideUp':
			return { from: { opacity: 0, y: 30 }, to: { opacity: 1, y: 0 } }
		case 'slideDown':
			return { from: { opacity: 0, y: -30 }, to: { opacity: 1, y: 0 } }
		case 'slideLeft':
			return { from: { opacity: 0, x: 30 }, to: { opacity: 1, x: 0 } }
		case 'slideRight':
			return { from: { opacity: 0, x: -30 }, to: { opacity: 1, x: 0 } }
		case 'scaleIn':
			return { from: { opacity: 0, scale: 0.8 }, to: { opacity: 1, scale: 1 } }
		case 'scaleOut':
			return { from: { opacity: 1, scale: 1 }, to: { opacity: 0, scale: 0.8 } }
		case 'bounceIn':
			return { from: { opacity: 0, scale: 0.3 }, to: { opacity: 1, scale: 1 } }
		case 'rotateIn':
			return {
				from: { opacity: 0, rotate: -90 },
				to: { opacity: 1, rotate: 0 },
			}
		case 'flipX':
			return {
				from: { opacity: 0, rotateX: 90 },
				to: { opacity: 1, rotateX: 0 },
			}
		case 'flipY':
			return {
				from: { opacity: 0, rotateY: 90 },
				to: { opacity: 1, rotateY: 0 },
			}
		case 'pulse':
			return { from: { scale: 1 }, to: { scale: [1, 1.05, 1] } }
		case 'shake':
			return { from: { x: 0 }, to: { x: [0, -5, 5, -5, 5, 0] } }
		default:
			return { from: { opacity: 0 }, to: { opacity: 1 } }
	}
}

function buildTransition(anim: AnimationConfig): Transition {
	const t: Transition = {
		duration: anim.duration,
		delay: anim.delay,
	}

	if (anim.ease === 'spring') {
		;(t as Record<string, unknown>).type = 'spring'
	} else {
		;(t as Record<string, unknown>).ease = anim.ease
	}

	if (anim.repeat !== 0) {
		;(t as Record<string, unknown>).repeat =
			anim.repeat === -1 ? Number.POSITIVE_INFINITY : anim.repeat
	}

	return t
}

// ========================================
// ComponentPreview — renders the actual component with real styles
// ========================================

function ComponentPreview({
	node,
	childNodes,
}: {
	node: ComponentNode
	childNodes: ComponentNode[]
}) {
	const { viewport } = useCanvasViewport()
	const def = getComponentDefinition(node.type)

	// Resolve StyleConfig → real CSS
	const resolvedStyles = useMemo(
		() => resolveStyleConfig(node.styles, viewport),
		[node.styles, viewport],
	)
	// Resolve effects → real CSS
	const effectStyles = useMemo(
		() => resolveEffects(node.effects),
		[node.effects],
	)

	// Merge base + effects
	const mergedStyles: React.CSSProperties = {
		...resolvedStyles,
		...effectStyles,
	}

	switch (node.type) {
		case 'group': {
			return (
				<div className='w-full h-full relative' style={mergedStyles}>
					{childNodes.map(child => (
						<CanvasNode
							key={child.id}
							nodeId={child.id}
							isSelected={false}
							onSelect={() => {}}
						/>
					))}
					{childNodes.length === 0 && (
						<div className='absolute inset-0 flex items-center justify-center text-xs text-gray-300 border border-dashed border-gray-300 rounded'>
							Group
						</div>
					)}
				</div>
			)
		}

		case 'container': {
			const direction = (node.props.direction as string) ?? 'column'
			const gap = SPACING_MAP[(node.props.gap as string) ?? 'md'] ?? '16px'
			const align = FLEX_ALIGN_MAP[(node.props.align as string) ?? 'stretch'] ?? 'stretch'
			const justify = FLEX_JUSTIFY_MAP[(node.props.justify as string) ?? 'start'] ?? 'flex-start'

			const containerCSS: React.CSSProperties = {
				display: 'flex',
				flexDirection: direction as 'row' | 'column',
				gap,
				alignItems: align,
				justifyContent: justify,
				width: '100%',
				height: '100%',
				minHeight: 40,
				...mergedStyles,
			}

			return (
				<div style={containerCSS}>
					{childNodes.length > 0 ? (
						childNodes.map(child => (
							<CanvasNode
								key={child.id}
								nodeId={child.id}
								isSelected={false}
								onSelect={() => {}}
							/>
						))
					) : (
						<div className='flex-1 flex items-center justify-center text-xs text-gray-300 dark:text-gray-600 border border-dashed border-gray-200 dark:border-gray-700 rounded min-h-[30px]'>
							Container
						</div>
					)}
				</div>
			)
		}

		case 'grid': {
			const cols = Number(node.props.columns) || 2
			const gap = SPACING_MAP[(node.props.gap as string) ?? 'md'] ?? '16px'

			const gridCSS: React.CSSProperties = {
				display: 'grid',
				gridTemplateColumns: `repeat(${cols}, 1fr)`,
				gap,
				width: '100%',
				height: '100%',
				...mergedStyles,
			}

			return (
				<div style={gridCSS}>
					{childNodes.length > 0 ? (
						childNodes.map(child => (
							<CanvasNode
								key={child.id}
								nodeId={child.id}
								isSelected={false}
								onSelect={() => {}}
							/>
						))
					) : (
						<div className='col-span-full flex items-center justify-center text-xs text-gray-300 dark:text-gray-600 border border-dashed border-gray-200 dark:border-gray-700 rounded min-h-[30px]'>
							Grid
						</div>
					)}
				</div>
			)
		}

		case 'text': {
			const content = (node.props.content as string) ?? 'Text content'
			const tag = (node.props.as as string) ?? 'p'
			const defaultTextStyles = HEADING_STYLES[tag] ?? {}

			const textCSS: React.CSSProperties = {
				width: '100%',
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				...defaultTextStyles,
				...mergedStyles,
			}

			return (
				<div style={textCSS}>{content}</div>
			)
		}

		case 'heading': {
			const content = (node.props.content as string) ?? 'Heading'
			const level = (node.props.level as number) ?? 1
			const tag = `h${level}`
			const defaultTextStyles = HEADING_STYLES[tag] ?? {}

			const headingCSS: React.CSSProperties = {
				width: '100%',
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				...defaultTextStyles,
				...mergedStyles,
			}

			return (
				<div style={headingCSS}>{content}</div>
			)
		}

		case 'button': {
			const text = (node.props.text as string) || (node.props.label as string) || 'Button'
			const variant = (node.props.variant as string) ?? 'solid'
			const size = (node.props.size as string) ?? 'md'
			const disabled = node.props.disabled as boolean

			const variantStyles = BUTTON_VARIANTS[variant] ?? BUTTON_VARIANTS.solid
			const sizeStyles = BUTTON_SIZES[size] ?? BUTTON_SIZES.md

			const buttonCSS: React.CSSProperties = {
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				height: '100%',
				borderRadius: '8px',
				fontWeight: 500,
				cursor: 'pointer',
				transition: 'background-color 0.15s, border-color 0.15s',
				border: 'none',
				...variantStyles,
				...sizeStyles,
				...(disabled ? { opacity: 0.5, pointerEvents: 'none' as const } : {}),
				...mergedStyles,
			}

			return (
				<button type='button' style={buttonCSS} tabIndex={-1}>
					{text}
				</button>
			)
		}

		case 'link': {
			const text = (node.props.text as string) ?? 'Click here'

			const linkCSS: React.CSSProperties = {
				width: '100%',
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				color: '#2563eb',
				textDecoration: 'underline',
				fontSize: '14px',
				cursor: 'pointer',
				...mergedStyles,
			}

			return (
				<div style={linkCSS}>{text}</div>
			)
		}

		case 'badge': {
			const text = (node.props.text as string) ?? 'Badge'
			const variant = (node.props.variant as string) ?? 'default'

			const badgeVariants: Record<string, React.CSSProperties> = {
				default: { backgroundColor: '#2563eb', color: '#ffffff' },
				outline: { backgroundColor: 'transparent', color: '#2563eb', border: '1px solid #2563eb' },
				destructive: { backgroundColor: '#ef4444', color: '#ffffff' },
			}

			const badgeCSS: React.CSSProperties = {
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				height: '100%',
				borderRadius: '9999px',
				fontSize: '12px',
				fontWeight: 500,
				paddingLeft: '10px',
				paddingRight: '10px',
				...badgeVariants[variant],
				...mergedStyles,
			}

			return (
				<div style={badgeCSS}>{text}</div>
			)
		}

		case 'separator': {
			const sepCSS: React.CSSProperties = {
				width: '100%',
				height: '1px',
				backgroundColor: '#e2e8f0',
				alignSelf: 'center',
				...mergedStyles,
			}
			return <div style={sepCSS} />
		}

		case 'image': {
			const src = (node.props.src as string) ?? ''
			const alt = (node.props.alt as string) ?? 'Image'
			const objectFit = (node.props.objectFit as string) ?? 'cover'

			const wrapperCSS: React.CSSProperties = {
				width: '100%',
				height: '100%',
				overflow: 'hidden',
				borderRadius: '8px',
				backgroundColor: '#f8fafc',
				...mergedStyles,
			}

			if (src) {
				return (
					<div style={wrapperCSS}>
						<img
							src={src}
							alt={alt}
							style={{
								width: '100%',
								height: '100%',
								objectFit: objectFit as 'cover' | 'contain' | 'fill',
								display: 'block',
							}}
						/>
					</div>
				)
			}

			return (
				<div style={{ ...wrapperCSS, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<svg width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='#cbd5e1' strokeWidth='1.5'>
						<rect x='3' y='3' width='18' height='18' rx='2' />
						<circle cx='8.5' cy='8.5' r='1.5' />
						<path d='m21 15-5-5L5 21' />
					</svg>
				</div>
			)
		}

		case 'icon': {
			const iconName = (node.props.iconName as string) ?? 'IconStar'
			const iconSize = (node.props.size as number) ?? 24
			const strokeWidth = (node.props.strokeWidth as number) ?? 2
			const color = node.styles?.base?.color
				? resolveStyleConfig({ base: { color: node.styles.base.color } }).color as string
				: '#6b7280'

			return (
				<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...mergedStyles }}>
					<IconPreview
						name={iconName}
						size={iconSize}
						strokeWidth={strokeWidth}
						color={color ?? '#6b7280'}
					/>
				</div>
			)
		}

		case 'input': {
			const placeholder = (node.props.placeholder as string) ?? 'Enter value...'
			const label = (node.props.label as string) ?? ''
			const inputType = (node.props.type as string) ?? 'text'

			const wrapperCSS: React.CSSProperties = {
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				gap: '6px',
				...mergedStyles,
			}

			return (
				<div style={wrapperCSS}>
					{label && (
						<label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>{label}</label>
					)}
					<input
						type={inputType}
						placeholder={placeholder}
						style={{
							border: '1px solid #d1d5db',
							borderRadius: '6px',
							padding: '8px 12px',
							fontSize: '14px',
							backgroundColor: '#ffffff',
							width: '100%',
							outline: 'none',
							color: '#111827',
						}}
						readOnly
						tabIndex={-1}
					/>
				</div>
			)
		}

		case 'textarea': {
			const placeholder = (node.props.placeholder as string) ?? 'Enter text...'
			const label = (node.props.label as string) ?? ''
			const rows = (node.props.rows as number) ?? 3

			const wrapperCSS: React.CSSProperties = {
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				gap: '6px',
				...mergedStyles,
			}

			return (
				<div style={wrapperCSS}>
					{label && (
						<label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>{label}</label>
					)}
					<textarea
						placeholder={placeholder}
						rows={rows}
						style={{
							border: '1px solid #d1d5db',
							borderRadius: '6px',
							padding: '8px 12px',
							fontSize: '14px',
							backgroundColor: '#ffffff',
							width: '100%',
							resize: 'none',
							outline: 'none',
							color: '#111827',
						}}
						readOnly
						tabIndex={-1}
					/>
				</div>
			)
		}

		case 'select': {
			const label = (node.props.label as string) ?? ''
			const options = (node.props.options as string[]) ?? ['Option 1', 'Option 2']

			const wrapperCSS: React.CSSProperties = {
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				gap: '6px',
				...mergedStyles,
			}

			return (
				<div style={wrapperCSS}>
					{label && (
						<label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>{label}</label>
					)}
					<select
						style={{
							border: '1px solid #d1d5db',
							borderRadius: '6px',
							padding: '8px 12px',
							fontSize: '14px',
							backgroundColor: '#ffffff',
							width: '100%',
							outline: 'none',
							color: '#111827',
							appearance: 'auto',
						}}
						tabIndex={-1}
					>
						{options.map(opt => (
							<option key={opt}>{opt}</option>
						))}
					</select>
				</div>
			)
		}

		case 'form': {
			const submitLabel = (node.props.submitLabel as string) ?? 'Submit'

			const formCSS: React.CSSProperties = {
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				gap: '12px',
				...mergedStyles,
			}

			return (
				<div style={formCSS}>
					{childNodes.length > 0 ? (
						childNodes.map(child => (
							<CanvasNode
								key={child.id}
								nodeId={child.id}
								isSelected={false}
								onSelect={() => {}}
							/>
						))
					) : (
						<div className='flex-1 flex items-center justify-center text-xs text-gray-300 dark:text-gray-600 border border-dashed border-gray-200 dark:border-gray-700 rounded min-h-[30px]'>
							Form
						</div>
					)}
					<button
						type='button'
						tabIndex={-1}
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '8px 16px',
							backgroundColor: '#2563eb',
							color: '#ffffff',
							borderRadius: '6px',
							fontSize: '14px',
							fontWeight: 500,
							border: 'none',
							cursor: 'pointer',
						}}
					>
						{submitLabel}
					</button>
				</div>
			)
		}

		case 'card': {
			const title = (node.props.title as string) ?? 'Card Title'
			const description = (node.props.description as string) ?? ''

			const cardCSS: React.CSSProperties = {
				width: '100%',
				height: '100%',
				border: '1px solid #e2e8f0',
				borderRadius: '12px',
				padding: '20px',
				backgroundColor: '#ffffff',
				boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
				...mergedStyles,
			}

			return (
				<div style={cardCSS}>
					<h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: 0 }}>{title}</h3>
					{description && (
						<p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px', margin: '8px 0 0 0', lineHeight: 1.5 }}>{description}</p>
					)}
					{childNodes.length > 0 && (
						<div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
							{childNodes.map(child => (
								<CanvasNode
									key={child.id}
									nodeId={child.id}
									isSelected={false}
									onSelect={() => {}}
								/>
							))}
						</div>
					)}
				</div>
			)
		}

		case 'tabs': {
			const tabs = (node.props.tabs as string[]) ?? ['Tab 1', 'Tab 2', 'Tab 3']

			const tabsCSS: React.CSSProperties = {
				width: '100%',
				height: '100%',
				...mergedStyles,
			}

			return (
				<div style={tabsCSS}>
					<div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', gap: '0' }}>
						{tabs.map((tab, i) => (
							<div
								key={tab}
								style={{
									padding: '8px 16px',
									fontSize: '13px',
									fontWeight: i === 0 ? 600 : 400,
									color: i === 0 ? '#2563eb' : '#64748b',
									borderBottom: i === 0 ? '2px solid #2563eb' : '2px solid transparent',
									marginBottom: '-2px',
									cursor: 'pointer',
								}}
							>
								{tab}
							</div>
						))}
					</div>
					<div style={{ padding: '16px', fontSize: '13px', color: '#64748b' }}>
						Tab content area
					</div>
				</div>
			)
		}

		default:
			return (
				<div
					style={{
						width: '100%',
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '12px',
						backgroundColor: '#f8fafc',
						border: '1px dashed #cbd5e1',
						borderRadius: '8px',
						...mergedStyles,
					}}
				>
					<span style={{ fontSize: '12px', color: '#94a3b8' }}>
						{def?.label || node.type}
					</span>
				</div>
			)
	}
}

// ========================================
// Canvas Empty Area
// ========================================

export function CanvasEmptyZone() {
	return (
		<div className='flex items-center justify-center min-h-[300px] border-2 border-dashed border-gray-200 rounded-lg text-gray-400'>
			<div className='text-center'>
				<p className='text-sm font-medium'>Drag components here</p>
				<p className='text-xs mt-1'>or click a component in the palette</p>
			</div>
		</div>
	)
}

// ========================================
// Constants & Maps
// ========================================

const SPACING_MAP: Record<string, string> = {
	none: '0',
	xs: '4px',
	sm: '8px',
	md: '16px',
	lg: '24px',
	xl: '32px',
	'2xl': '48px',
}

const FLEX_ALIGN_MAP: Record<string, string> = {
	start: 'flex-start',
	center: 'center',
	end: 'flex-end',
	stretch: 'stretch',
}

const FLEX_JUSTIFY_MAP: Record<string, string> = {
	start: 'flex-start',
	center: 'center',
	end: 'flex-end',
	between: 'space-between',
	around: 'space-around',
}

const HEADING_STYLES: Record<string, React.CSSProperties> = {
	h1: { fontSize: '36px', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.025em' },
	h2: { fontSize: '30px', fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.02em' },
	h3: { fontSize: '24px', fontWeight: 600, lineHeight: 1.3 },
	h4: { fontSize: '20px', fontWeight: 600, lineHeight: 1.35 },
	h5: { fontSize: '18px', fontWeight: 500, lineHeight: 1.4 },
	h6: { fontSize: '16px', fontWeight: 500, lineHeight: 1.4 },
	p:  { fontSize: '14px', fontWeight: 400, lineHeight: 1.6 },
	span: { fontSize: '14px', fontWeight: 400 },
	div: { fontSize: '14px', fontWeight: 400 },
}

const BUTTON_VARIANTS: Record<string, React.CSSProperties> = {
	solid:   { backgroundColor: '#2563eb', color: '#ffffff' },
	default: { backgroundColor: '#2563eb', color: '#ffffff' },
	outline: { backgroundColor: 'transparent', color: '#2563eb', border: '2px solid #2563eb' },
	ghost:   { backgroundColor: 'transparent', color: '#2563eb' },
	soft:    { backgroundColor: '#dbeafe', color: '#1d4ed8' },
	destructive: { backgroundColor: '#ef4444', color: '#ffffff' },
}

const BUTTON_SIZES: Record<string, React.CSSProperties> = {
	sm: { padding: '6px 12px', fontSize: '13px' },
	md: { padding: '8px 16px', fontSize: '14px' },
	lg: { padding: '12px 24px', fontSize: '16px' },
}

// ========================================
// Icon Preview (dynamic Tabler icon render)
// ========================================

const ICON_PATHS: Record<string, string> = {
	IconStar: 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z',
	IconHome: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
	IconUser: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
	IconHeart: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
	IconMail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
	IconSearch: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
	IconCheck: 'M5 12l5 5L20 7',
}

function IconPreview({
	name,
	size,
	strokeWidth,
	color,
}: {
	name: string
	size: number
	strokeWidth: number
	color: string
}) {
	const path = ICON_PATHS[name]

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				color,
				position: 'relative',
			}}
		>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width={size}
				height={size}
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth={strokeWidth}
				strokeLinecap='round'
				strokeLinejoin='round'
			>
				{path ? (
					<path d={path} />
				) : (
					<polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
				)}
			</svg>
		</div>
	)
}
