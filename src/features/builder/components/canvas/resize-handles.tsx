'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface ResizeHandlesProps {
	nodeId: string
	width: number
	height: number
	rotation: number
	/** Combined canvas scale (zoom * vpScale). Mouse deltas are divided by this. */
	canvasScale?: number
	onResize: (
		size: { width: number; height: number },
		positionDelta?: { dx: number; dy: number },
	) => void
	onResizeStart?: () => void
	onResizeEnd?: () => void
	onRotate?: (rotation: number) => void
	minWidth?: number
	minHeight?: number
	snapGrid?: number
}

type HandlePosition =
	| 'top-left'
	| 'top'
	| 'top-right'
	| 'right'
	| 'bottom-right'
	| 'bottom'
	| 'bottom-left'
	| 'left'

const HANDLE_SIZE = 8
const MIN_W = 24
const MIN_H = 24
const SNAP = 4
const ROTATION_HANDLE_OFFSET = 24

const handlePositions: HandlePosition[] = [
	'top-left',
	'top',
	'top-right',
	'right',
	'bottom-right',
	'bottom',
	'bottom-left',
	'left',
]

const cursorMap: Record<HandlePosition, string> = {
	'top-left': 'nwse-resize',
	top: 'ns-resize',
	'top-right': 'nesw-resize',
	right: 'ew-resize',
	'bottom-right': 'nwse-resize',
	bottom: 'ns-resize',
	'bottom-left': 'nesw-resize',
	left: 'ew-resize',
}

function getHandleStyle(pos: HandlePosition): React.CSSProperties {
	const half = -HANDLE_SIZE / 2
	const base: React.CSSProperties = {
		position: 'absolute',
		width: HANDLE_SIZE,
		height: HANDLE_SIZE,
		cursor: cursorMap[pos],
		zIndex: 50,
	}
	switch (pos) {
		case 'top-left':
			return { ...base, top: half, left: half }
		case 'top':
			return { ...base, top: half, left: '50%', marginLeft: half }
		case 'top-right':
			return { ...base, top: half, right: half }
		case 'right':
			return { ...base, top: '50%', marginTop: half, right: half }
		case 'bottom-right':
			return { ...base, bottom: half, right: half }
		case 'bottom':
			return { ...base, bottom: half, left: '50%', marginLeft: half }
		case 'bottom-left':
			return { ...base, bottom: half, left: half }
		case 'left':
			return { ...base, top: '50%', marginTop: half, left: half }
	}
}

export function ResizeHandles({
	width,
	height,
	rotation,
	onResize,
	onResizeStart,
	onResizeEnd,
	onRotate,
	minWidth = MIN_W,
	minHeight = MIN_H,
	snapGrid = SNAP,
	canvasScale = 1,
}: ResizeHandlesProps) {
	const [activeHandle, setActiveHandle] = useState<HandlePosition | null>(null)
	const [isRotating, setIsRotating] = useState(false)
	const startRef = useRef<{
		x: number
		y: number
		width: number
		height: number
	} | null>(null)
	const rotateRef = useRef<{
		centerX: number
		centerY: number
		startAngle: number
		startRotation: number
	} | null>(null)
	const parentRef = useRef<HTMLElement | null>(null)

	const snap = useCallback(
		(v: number) => Math.round(v / snapGrid) * snapGrid,
		[snapGrid],
	)

	const handleMouseDown = useCallback(
		(e: React.MouseEvent, position: HandlePosition) => {
			e.preventDefault()
			e.stopPropagation()
			setActiveHandle(position)
			startRef.current = {
				x: e.clientX,
				y: e.clientY,
				width,
				height,
			}
			parentRef.current = (e.currentTarget as HTMLElement).parentElement
			onResizeStart?.()
		},
		[width, height, onResizeStart],
	)

	// --- Rotation handle ---
	const handleRotateMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault()
			e.stopPropagation()
			setIsRotating(true)

			const el = (e.currentTarget as HTMLElement).parentElement
			if (!el) return
			const rect = el.getBoundingClientRect()
			const centerX = rect.left + rect.width / 2
			const centerY = rect.top + rect.height / 2

			const startAngle =
				Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)

			rotateRef.current = {
				centerX,
				centerY,
				startAngle,
				startRotation: rotation,
			}
		},
		[rotation],
	)

	// Resize effect
	useEffect(() => {
		if (!activeHandle) return

		const handleMouseMove = (e: MouseEvent) => {
			if (!startRef.current) return
			// Divide by canvasScale so 1px mouse movement = 1px canvas movement
			const dx = (e.clientX - startRef.current.x) / canvasScale
			const dy = (e.clientY - startRef.current.y) / canvasScale

			let newW = startRef.current.width
			let newH = startRef.current.height
			let posDx = 0
			let posDy = 0

			// Horizontal resize
			if (activeHandle.includes('right')) {
				newW = snap(Math.max(minWidth, startRef.current.width + dx))
			} else if (activeHandle.includes('left')) {
				const raw = snap(Math.max(minWidth, startRef.current.width - dx))
				posDx = startRef.current.width - raw
				newW = raw
			}

			// Vertical resize
			if (activeHandle.includes('bottom') || activeHandle === 'bottom') {
				newH = snap(Math.max(minHeight, startRef.current.height + dy))
			} else if (activeHandle.includes('top') || activeHandle === 'top') {
				const raw = snap(Math.max(minHeight, startRef.current.height - dy))
				posDy = startRef.current.height - raw
				newH = raw
			}

			// Shift = proportional resize (corner handles)
			if (e.shiftKey && activeHandle.includes('-')) {
				const aspectRatio = startRef.current.width / startRef.current.height
				if (Math.abs(dx) > Math.abs(dy)) {
					newH = snap(Math.max(minHeight, Math.round(newW / aspectRatio)))
				} else {
					newW = snap(Math.max(minWidth, Math.round(newH * aspectRatio)))
				}
			}

			// Alt = resize from center
			if (e.altKey) {
				const wDiff = newW - startRef.current.width
				const hDiff = newH - startRef.current.height
				// Expand equally on both sides
				newW = startRef.current.width + Math.abs(wDiff) * 2
				newH = startRef.current.height + Math.abs(hDiff) * 2
				newW = snap(Math.max(minWidth, newW))
				newH = snap(Math.max(minHeight, newH))
				posDx = -(newW - startRef.current.width) / 2
				posDy = -(newH - startRef.current.height) / 2
			}

			const hasPosDelta = posDx !== 0 || posDy !== 0
			onResize(
				{ width: newW, height: newH },
				hasPosDelta ? { dx: posDx, dy: posDy } : undefined,
			)
		}

		const handleMouseUp = () => {
			setActiveHandle(null)
			startRef.current = null
			onResizeEnd?.()
		}

		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}
	}, [activeHandle, minWidth, minHeight, snap, onResize, onResizeEnd, canvasScale])

	// Rotation effect
	useEffect(() => {
		if (!isRotating) return

		const handleMouseMove = (e: MouseEvent) => {
			if (!rotateRef.current || !onRotate) return
			const { centerX, centerY, startAngle, startRotation } = rotateRef.current

			const currentAngle =
				Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)

			let newRotation = startRotation + (currentAngle - startAngle)

			// Snap to 15° increments when holding Shift
			if (e.shiftKey) {
				newRotation = Math.round(newRotation / 15) * 15
			}

			// Normalize
			newRotation = ((newRotation % 360) + 360) % 360

			onRotate(newRotation)
		}

		const handleMouseUp = () => {
			setIsRotating(false)
			rotateRef.current = null
		}

		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}
	}, [isRotating, onRotate])

	return (
		<>
			{/* Resize handles */}
			{handlePositions.map(pos => (
				// biome-ignore lint/a11y/noStaticElementInteractions: resize handle
				<div
					key={pos}
					style={getHandleStyle(pos)}
					className={cn(
						'bg-white border-2 border-blue-500 rounded-sm transition-transform hover:scale-125',
						activeHandle === pos && 'scale-125 bg-blue-500',
					)}
					onMouseDown={e => handleMouseDown(e, pos)}
				/>
			))}

			{/* Rotation handle */}
			{onRotate && (
				<>
					{/* Line from top center to rotation handle */}
					<div
						className='absolute left-1/2 pointer-events-none'
						style={{
							top: -ROTATION_HANDLE_OFFSET,
							width: 1,
							height: ROTATION_HANDLE_OFFSET - HANDLE_SIZE / 2,
							backgroundColor: '#3b82f6',
							marginLeft: -0.5,
						}}
					/>
					{/* Rotation dot */}
					{/* biome-ignore lint/a11y/noStaticElementInteractions: rotation handle */}
					<div
						className={cn(
							'absolute left-1/2 cursor-grab transition-transform hover:scale-125',
							isRotating && 'scale-125 cursor-grabbing',
						)}
						style={{
							top: -ROTATION_HANDLE_OFFSET - HANDLE_SIZE / 2,
							width: HANDLE_SIZE + 2,
							height: HANDLE_SIZE + 2,
							marginLeft: -(HANDLE_SIZE + 2) / 2,
							borderRadius: '50%',
							backgroundColor: isRotating ? '#3b82f6' : '#fff',
							border: '2px solid #3b82f6',
							zIndex: 51,
						}}
						onMouseDown={handleRotateMouseDown}
					/>
				</>
			)}

			{/* Size tooltip while resizing */}
			{activeHandle && (
				<div className='absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-mono rounded whitespace-nowrap z-50'>
					{Math.round(width)} × {Math.round(height)}
				</div>
			)}

			{/* Rotation tooltip */}
			{isRotating && (
				<div className='absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-mono rounded whitespace-nowrap z-50'>
					{Math.round(rotation)}°
				</div>
			)}
		</>
	)
}
