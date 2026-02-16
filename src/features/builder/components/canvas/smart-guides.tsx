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
): SnapResult {
	const guides: SnapLine[] = []
	let snappedX = dragX
	let snappedY = dragY

	if (!pageId) return { x: snappedX, y: snappedY, guides }

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
