'use client'

import { useMemo } from 'react'
import { useCanvasStore, type ComponentNode } from '../../stores/canvas-store'

// ========================================
// Types
// ========================================

export interface SnapLine {
	type: 'vertical' | 'horizontal'
	position: number
	from: number
	to: number
}

interface SnapResult {
	x: number
	y: number
	guides: SnapLine[]
}

const SNAP_THRESHOLD = 6 // px
const GRID_SIZE = 8 // px for grid snapping (Phase 2)
const SPACING_SNAP = [8, 16, 24, 32, 40, 48] // Common spacing values (Phase 2)

// ========================================
// Snap Engine
// ========================================

export function calculateSnap(
	draggedId: string,
	dragX: number,
	dragY: number,
	dragW: number,
	dragH: number,
	allNodes: Record<string, ComponentNode>,
	pageId: string | null,
	enableGridSnap = true, // Phase 2: Grid snapping toggle
): SnapResult {
	const guides: SnapLine[] = []
	let snappedX = dragX
	let snappedY = dragY

	if (!pageId) return { x: snappedX, y: snappedY, guides }

	// Phase 2: Grid snapping (takes precedence if no element snapping found)
	if (enableGridSnap) {
		const gridSnappedX = Math.round(dragX / GRID_SIZE) * GRID_SIZE
		const gridSnappedY = Math.round(dragY / GRID_SIZE) * GRID_SIZE
		
		if (Math.abs(dragX - gridSnappedX) < SNAP_THRESHOLD) {
			snappedX = gridSnappedX
		}
		if (Math.abs(dragY - gridSnappedY) < SNAP_THRESHOLD) {
			snappedY = gridSnappedY
		}
	}

	const otherNodes = Object.values(allNodes).filter(
		n =>
			n.id !== draggedId &&
			n.pageId === pageId &&
			n.visible &&
			n.parentId === null,
	)

	if (otherNodes.length === 0) return { x: snappedX, y: snappedY, guides }

	// Dragged node edges & center
	const dragLeft = dragX
	const dragRight = dragX + dragW
	const dragCenterX = dragX + dragW / 2
	const dragTop = dragY
	const dragBottom = dragY + dragH
	const dragCenterY = dragY + dragH / 2

	let closestDx = SNAP_THRESHOLD + 1
	let closestDy = SNAP_THRESHOLD + 1

	for (const other of otherNodes) {
		const oLeft = other.position.x
		const oRight = other.position.x + other.size.width
		const oCenterX = other.position.x + other.size.width / 2
		const oTop = other.position.y
		const oBottom = other.position.y + other.size.height
		const oCenterY = other.position.y + other.size.height / 2

		// Vertical snap lines (x-axis alignment)
		const vSnaps: [number, number][] = [
			[dragLeft, oLeft],
			[dragLeft, oRight],
			[dragLeft, oCenterX],
			[dragRight, oLeft],
			[dragRight, oRight],
			[dragRight, oCenterX],
			[dragCenterX, oCenterX],
			[dragCenterX, oLeft],
			[dragCenterX, oRight],
		]

		for (const [dragEdge, otherEdge] of vSnaps) {
			const diff = Math.abs(dragEdge - otherEdge)
			if (diff < SNAP_THRESHOLD && diff < closestDx) {
				closestDx = diff
				snappedX = dragX + (otherEdge - dragEdge)
				const minY = Math.min(dragTop, oTop)
				const maxY = Math.max(dragBottom, oBottom)
				guides.push({
					type: 'vertical',
					position: otherEdge,
					from: minY,
					to: maxY,
				})
			}
		}

		// Horizontal snap lines (y-axis alignment)
		const hSnaps: [number, number][] = [
			[dragTop, oTop],
			[dragTop, oBottom],
			[dragTop, oCenterY],
			[dragBottom, oTop],
			[dragBottom, oBottom],
			[dragBottom, oCenterY],
			[dragCenterY, oCenterY],
			[dragCenterY, oTop],
			[dragCenterY, oBottom],
		]

		for (const [dragEdge, otherEdge] of hSnaps) {
			const diff = Math.abs(dragEdge - otherEdge)
			if (diff < SNAP_THRESHOLD && diff < closestDy) {
				closestDy = diff
				snappedY = dragY + (otherEdge - dragEdge)
				const minX = Math.min(dragLeft, oLeft)
				const maxX = Math.max(dragRight, oRight)
				guides.push({
					type: 'horizontal',
					position: otherEdge,
					from: minX,
					to: maxX,
				})
			}
		}

		// Phase 2: Spacing snapping (consistent gaps between elements)
		// Check horizontal spacing (gap between right edge of other and left edge of dragged)
		const hGap = dragLeft - oRight
		for (const spacing of SPACING_SNAP) {
			if (Math.abs(hGap - spacing) < SNAP_THRESHOLD) {
				const snapX = oRight + spacing
				if (Math.abs(dragLeft - snapX) < closestDx) {
					closestDx = Math.abs(dragLeft - snapX)
					snappedX = dragX + (snapX - dragLeft)
					// Show spacing guide
					guides.push({
						type: 'vertical',
						position: snapX,
						from: Math.min(dragTop, oTop),
						to: Math.max(dragBottom, oBottom),
					})
				}
			}
		}

		// Check vertical spacing (gap between bottom edge of other and top edge of dragged)
		const vGap = dragTop - oBottom
		for (const spacing of SPACING_SNAP) {
			if (Math.abs(vGap - spacing) < SNAP_THRESHOLD) {
				const snapY = oBottom + spacing
				if (Math.abs(dragTop - snapY) < closestDy) {
					closestDy = Math.abs(dragTop - snapY)
					snappedY = dragY + (snapY - dragTop)
					// Show spacing guide
					guides.push({
						type: 'horizontal',
						position: snapY,
						from: Math.min(dragLeft, oLeft),
						to: Math.max(dragRight, oRight),
					})
				}
			}
		}
	}

	// Deduplicate guides (keep unique by type+position)
	const uniqueGuides: SnapLine[] = []
	const seen = new Set<string>()
	for (const g of guides) {
		const key = `${g.type}:${g.position}`
		if (!seen.has(key)) {
			seen.add(key)
			uniqueGuides.push(g)
		}
	}

	return { x: snappedX, y: snappedY, guides: uniqueGuides }
}

// ========================================
// SmartGuides overlay component
// ========================================

interface SmartGuidesProps {
	guides: SnapLine[]
}

export function SmartGuides({ guides }: SmartGuidesProps) {
	if (guides.length === 0) return null

	return (
		<svg
			className='absolute inset-0 pointer-events-none z-[100]'
			style={{ overflow: 'visible' }}
		>
			{guides.map((guide, i) => {
				const key = `${guide.type}-${guide.position}-${i}`
				if (guide.type === 'vertical') {
					return (
						<line
							key={key}
							x1={guide.position}
							y1={guide.from}
							x2={guide.position}
							y2={guide.to}
							stroke='#f43f5e'
							strokeWidth={1}
							strokeDasharray='4 2'
						/>
					)
				}
				return (
					<line
						key={key}
						x1={guide.from}
						y1={guide.position}
						x2={guide.to}
						y2={guide.position}
						stroke='#f43f5e'
						strokeWidth={1}
						strokeDasharray='4 2'
					/>
				)
			})}
		</svg>
	)
}
