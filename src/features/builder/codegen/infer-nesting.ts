/**
 * Infer parent-child relationships from spatial positions.
 * Used by both tsx-preview-generator and nextjs-generator.
 */

import type { ComponentNode } from '../stores/canvas-store'

const CONTAINER_TYPES = new Set([
	'container',
	'card',
	'form',
	'group',
	'grid',
	'tabs',
])

/**
 * Check if node `inner` is visually inside `outer` (>50% overlap).
 */
function isInsideBounds(
	inner: ComponentNode,
	outer: ComponentNode,
): boolean {
	const ix = inner.position.x
	const iy = inner.position.y
	const iw = inner.size.width
	const ih = inner.size.height

	const ox = outer.position.x
	const oy = outer.position.y
	const ow = outer.size.width
	const oh = outer.size.height

	const overlapX = Math.max(0, Math.min(ix + iw, ox + ow) - Math.max(ix, ox))
	const overlapY = Math.max(0, Math.min(iy + ih, oy + oh) - Math.max(iy, oy))
	const overlapArea = overlapX * overlapY
	const innerArea = iw * ih

	return innerArea > 0 && overlapArea / innerArea > 0.5
}

/**
 * Infer parent-child relationships from spatial positions.
 * Nodes visually inside container-type nodes get parentId assigned.
 * Returns shallow copies with updated parentId — original nodes are not mutated.
 */
export function inferSpatialParentage(nodes: ComponentNode[]): ComponentNode[] {
	// If any node already has explicit parentId, skip inference
	const hasExplicitParenting = nodes.some(n => n.parentId !== null)
	if (hasExplicitParenting) return nodes

	// Containers sorted by area ascending (smallest first → match innermost container)
	const containers = nodes
		.filter(n => CONTAINER_TYPES.has(n.type))
		.sort(
			(a, b) =>
				a.size.width * a.size.height - (b.size.width * b.size.height),
		)

	if (containers.length === 0) return nodes

	// Clone nodes for mutation
	const result = nodes.map(n => ({ ...n }))
	const containerSet = new Set(containers.map(c => c.id))
	const byId = new Map(result.map(n => [n.id, n]))

	// First pass: nest non-container nodes into their smallest enclosing container
	for (const node of result) {
		if (node.parentId !== null) continue
		if (containerSet.has(node.id)) continue

		for (const container of containers) {
			const containerClone = byId.get(container.id)!
			if (isInsideBounds(node, containerClone)) {
				node.parentId = container.id
				break
			}
		}
	}

	// Second pass: nest containers inside larger containers
	for (const inner of containers) {
		const innerClone = byId.get(inner.id)!
		if (innerClone.parentId !== null) continue

		for (const outer of containers) {
			if (inner.id === outer.id) continue
			const outerArea = outer.size.width * outer.size.height
			const innerArea = inner.size.width * inner.size.height
			if (outerArea <= innerArea) continue

			const outerClone = byId.get(outer.id)!
			if (isInsideBounds(innerClone, outerClone)) {
				innerClone.parentId = outer.id
				break
			}
		}
	}

	// Re-assign order within each parent group (by Y then X position)
	const groups = new Map<string | null, ComponentNode[]>()
	for (const node of result) {
		const key = node.parentId
		if (!groups.has(key)) groups.set(key, [])
		groups.get(key)!.push(node)
	}
	for (const [, children] of groups) {
		children.sort(
			(a, b) => a.position.y - b.position.y || a.position.x - b.position.x,
		)
		children.forEach((c, i) => {
			c.order = i
		})
	}

	return result
}
